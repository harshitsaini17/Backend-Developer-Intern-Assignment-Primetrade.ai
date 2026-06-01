import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.15)] border border-white/20 backdrop-blur-xl animate-slide-in min-w-[280px]"
          style={{
            background:
              toast.type === 'success'
                ? 'linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95))'
                : toast.type === 'error'
                ? 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.95))'
                : 'linear-gradient(135deg, rgba(79,70,229,0.95), rgba(67,56,202,0.95))',
          }}
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-white/90 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-white/90 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-white/90 shrink-0" />}
          <span className="text-sm font-medium text-white flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}