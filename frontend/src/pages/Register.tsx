import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast, ToastContainer } from '../components/Toast';
import { Mail, Lock, ArrowRight, Sparkles, UserRound } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      addToast('Account created!', 'success');
      navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase = 'w-full bg-transparent border-b-2 border-slate-200 py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-300 focus:border-indigo-500';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-white/50 p-10 animate-scale-in">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 mb-5 animate-fade-up">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight animate-fade-up animate-delay-100">
              Create account
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 animate-fade-up animate-delay-200">
              Get started with your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative animate-fade-up animate-delay-100">
              <UserRound className={`absolute left-0 bottom-3.5 w-5 h-5 transition-colors duration-300 ${focusedField === 'name' || name ? 'text-indigo-500' : 'text-slate-300'}`} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required
                minLength={2}
                className={inputBase}
                placeholder="Full name"
              />
            </div>

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

            <div className="relative animate-fade-up animate-delay-300">
              <Lock className={`absolute left-0 bottom-3.5 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' || password ? 'text-indigo-500' : 'text-slate-300'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                minLength={8}
                className={inputBase}
                placeholder="Password (8+ characters)"
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
                  Creating...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6 animate-fade-up animate-delay-300">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}