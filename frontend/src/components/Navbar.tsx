import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, UserRound } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-[10px]">PT</span>
          </div>
          <span className="text-sm font-semibold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
            Primetrade
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
              {user.role === 'ADMIN' ? (
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
              ) : (
                <UserRound className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="text-xs font-medium text-slate-600">{user.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}