import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Menu, X, ArrowUpRight, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Next</span>
              <span className="text-xl font-extrabold text-blue-600 tracking-tight">Hire</span>
              <span className="w-2 h-2 rounded-full bg-blue-600 ml-1"></span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/jobs"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Explore Jobs
            </Link>
            <Link
              to="/jobs?jobType=internship"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Internships
            </Link>
            <Link
              to="/jobs?workplaceType=remote"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Remote Roles
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 text-sm font-medium text-slate-700 hover:text-slate-900 transition-all bg-white"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>Dashboard</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-semibold uppercase tracking-wider text-slate-600">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-sm font-medium shadow-sm hover:shadow transition-all duration-200 group"
                >
                  <span>Post a Job</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Jobs
          </Link>
          <Link
            to="/jobs?jobType=internship"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Internships
          </Link>
          <Link
            to="/jobs?workplaceType=remote"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Remote Roles
          </Link>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={user.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-blue-50 text-blue-700 font-medium text-sm"
                >
                  Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-full text-rose-600 hover:bg-rose-50 font-medium text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-slate-200 text-slate-700 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-slate-900 text-white font-medium text-sm"
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
