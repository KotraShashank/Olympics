// Navbar component
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User, Home, Activity, Dumbbell, Medal, HistoryIcon, Target, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/sports', label: 'Sports', icon: Dumbbell },
    { to: '/performance', label: 'Performance', icon: Activity },
    { to: '/leaderboard', label: 'Leaderboard', icon: Medal },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-800/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="relative">
              <Trophy className="w-7 h-7 text-gold animate-pulse-glow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full animate-ping" />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">
              OlympicPath
            </span>
          </Link>

          {/* Nav Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${active
                        ? 'bg-primary-600/30 text-primary-300 border border-primary-500/40'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* User menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <User className="w-4 h-4 text-primary-400" />
                    <span className="text-sm text-gray-300 font-medium hidden sm:inline">{user?.username}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-dark-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className="text-xs text-gray-500 font-semibold">ACCOUNT</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-primary-600/20 hover:text-primary-300 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>

                      <div className="px-3 py-2 border-t border-white/10">
                        <p className="text-xs text-gray-500 font-semibold">PROGRESS</p>
                      </div>
                      <Link
                        to="/match-history"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-orange-600/20 hover:text-orange-300 transition-colors"
                      >
                        <HistoryIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Match History</span>
                      </Link>
                      <Link
                        to="/qualifications"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                      >
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Qualifications</span>
                      </Link>

                      <div className="px-3 py-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600/20 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-1.5 text-sm text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-1.5 text-sm bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
