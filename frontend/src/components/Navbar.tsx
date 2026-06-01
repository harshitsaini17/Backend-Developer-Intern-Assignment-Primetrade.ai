import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, User } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PT</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Primetrade</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm">
                {user.role === 'ADMIN' ? (
                  <Shield className="w-4 h-4 text-indigo-600" />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
                <span className="font-medium text-gray-700">{user.name}</span>
                <span className="text-gray-400">|</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}