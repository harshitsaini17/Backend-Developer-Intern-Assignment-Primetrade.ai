import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;