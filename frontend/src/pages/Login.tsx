import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast, ToastContainer } from '../components/Toast';
import { Mail, Lock, ArrowRight, Sparkles, Shield, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      addToast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (emailVal: string, passwordVal: string) => {
    setEmail(emailVal);
    setPassword(passwordVal);
    addToast('Demo credentials filled', 'info');
  };

  const inputBase = 'w-full bg-transparent border-b-2 border-slate-200 py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-300 focus:border-indigo-500';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Subtle background dots */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-white/50 p-10 animate-scale-in">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 mb-5 animate-fade-up">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight animate-fade-up animate-delay-100">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 animate-fade-up animate-delay-200">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative animate-fade-up animate-delay-200">
              <Mail className={`absolute left-0 bottom-3.5 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' || email ? 'text-indigo-500' : 'text-slate-300'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                className={inputBase}
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div className="relative animate-fade-up animate-delay-300">
              <Lock className={`absolute left-0 bottom-3.5 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' || password ? 'text-indigo-500' : 'text-slate-300'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                className={inputBase}
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full bg-slate-900 text-white py-3.5 px-6 rounded-xl font-medium text-sm tracking-wide hover:bg-slate-800 focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 animate-fade-up animate-delay-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6 animate-fade-up animate-delay-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Create one
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t border-slate-100 animate-fade-up animate-delay-300">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemo('admin@primetrade.ai', 'Admin@123456')}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all duration-300 group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-700">Admin</p>
                  <p className="text-[10px] text-slate-400">admin@primetrade.ai</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('demo@primetrade.ai', 'Demo@123456')}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 transition-all duration-300 group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-700">User</p>
                  <p className="text-[10px] text-slate-400">demo@primetrade.ai</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}