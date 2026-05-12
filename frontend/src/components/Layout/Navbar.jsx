import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Bell, 
  LogOut, 
  User,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold">PlacementPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/questions" className="text-gray-300 hover:text-white transition-colors">
                  Questions
                </Link>
                <Link to="/tests" className="text-gray-300 hover:text-white transition-colors">
                  Tests
                </Link>
                <Link to="/companies" className="text-gray-300 hover:text-white transition-colors">
                  Companies
                </Link>
                <Link to="/progress" className="text-gray-300 hover:text-white transition-colors">
                  Progress
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl border border-gray-700 shadow-xl z-50 py-2">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                              Admin
                            </span>
                          )}
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors text-primary-400"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors text-red-400"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && user && (
          <div className="md:hidden pt-4 mt-4 border-t border-gray-700">
            <div className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={() => setShowMenu(false)}
                className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/questions"
                onClick={() => setShowMenu(false)}
                className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Questions
              </Link>
              <Link
                to="/tests"
                onClick={() => setShowMenu(false)}
                className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Tests
              </Link>
              <Link
                to="/companies"
                onClick={() => setShowMenu(false)}
                className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Companies
              </Link>
              <Link
                to="/progress"
                onClick={() => setShowMenu(false)}
                className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Progress
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;