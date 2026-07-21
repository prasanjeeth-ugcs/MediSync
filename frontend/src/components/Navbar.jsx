import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Menu, X, Stethoscope } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { token, setToken, setUserId, userData } = useContext(AppContext);
  const [profileMenu, setProfileMenu] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    setUserId('');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setProfileMenu(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home',        to: '/' },
    { name: 'All Doctors', to: '/doctors' },
    { name: 'About',       to: '/about' },
    { name: 'Contact',     to: '/contact' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-surface border-b border-surface-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* ─── Brand ─── */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-ink">
            Medi<span className="text-brand-600">Sync</span>
          </span>
        </div>

        {/* ─── Desktop nav links ─── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-100'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <a
            href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5175/'}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 px-3 py-2 rounded-lg text-sm font-medium text-ink-secondary hover:text-ink hover:bg-surface-100 transition-colors"
          >
            Admin
          </a>
        </div>

        {/* ─── Right side ─── */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!token ? (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary hidden md:inline-flex"
            >
              Create Account
            </button>
          ) : (
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setProfileMenu(true)}
              onMouseLeave={() => setProfileMenu(false)}
            >
              {userData?.image ? (
                <img
                  src={userData.image}
                  alt="Profile"
                  className="h-9 w-9 rounded-full cursor-pointer border-2 border-brand-200 shadow-sm object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm cursor-pointer border-2 border-brand-200">
                  {userData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}

              {profileMenu && (
                <div className="absolute right-0 mt-2 w-52 card py-1 shadow-card-hover animate-fade-up">
                  <button
                    onClick={() => { navigate('/my-profile'); setProfileMenu(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-surface-100 rounded-lg transition-colors font-medium"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/my-appointments'); setProfileMenu(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-surface-100 rounded-lg transition-colors font-medium"
                  >
                    My Appointments
                  </button>
                  <div className="divider my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebar(true)}
            aria-label="Open menu"
            className="md:hidden p-2 rounded-xl hover:bg-surface-100 transition-colors text-ink-secondary"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* ─── Mobile Sidebar ─── */}
      {sidebar && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex"
          onClick={() => setSidebar(false)}
        >
          <div
            className="bg-surface w-72 h-full p-6 flex flex-col shadow-2xl border-r border-surface-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Sidebar header */}
            <div className="flex justify-between items-center mb-8">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => { navigate('/'); setSidebar(false); }}
              >
                <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
                  <Stethoscope size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-ink">
                  Medi<span className="text-brand-600">Sync</span>
                </span>
              </div>
              <button
                onClick={() => setSidebar(false)}
                aria-label="Close menu"
                className="p-2 rounded-xl hover:bg-surface-100 transition-colors text-ink-secondary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sidebar links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setSidebar(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-secondary hover:text-ink hover:bg-surface-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <a
                href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5175/'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:text-ink hover:bg-surface-100 transition-colors"
                onClick={() => setSidebar(false)}
              >
                Admin / Doctor Login
              </a>
            </nav>

            {/* Sidebar auth */}
            <div className="mt-6">
              {!token ? (
                <button
                  onClick={() => { navigate('/login'); setSidebar(false); }}
                  className="btn-primary w-full btn-lg"
                >
                  Create Account
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => { navigate('/my-profile'); setSidebar(false); }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-surface-100 transition-colors text-left"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/my-appointments'); setSidebar(false); }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-surface-100 transition-colors text-left"
                  >
                    My Appointments
                  </button>
                  <button
                    onClick={() => { handleLogout(); setSidebar(false); }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-red-50 transition-colors text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;