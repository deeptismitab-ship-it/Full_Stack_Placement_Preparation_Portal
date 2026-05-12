import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      showError('', 0);
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@placementportal.com');
    setPassword('admin123');
    setLoading(true);
    try {
      await login('admin@placementportal.com', 'admin123');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-10 h-10 text-primary-500" />
            <span className="text-2xl font-bold">PlacementPortal</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to continue your preparation</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none transition-colors pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleDemoLogin}
              className="w-full py-3 border border-gray-600 hover:border-gray-500 rounded-lg font-medium transition-colors text-gray-400 hover:text-white"
            >
              Try Demo Account
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
          <p className="text-sm text-gray-400 mb-2">Demo Admin Credentials:</p>
          <p className="text-xs text-gray-500">Email: admin@placementportal.com</p>
          <p className="text-xs text-gray-500">Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;