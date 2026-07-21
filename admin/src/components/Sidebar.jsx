import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FileText, User, X, Stethoscope } from 'lucide-react';

const navItems = {
  admin: [
    { to: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor-list', label: 'Doctors', icon: Users },
    { to: '/add-doctor', label: 'Add Doctor', icon: UserPlus },
  ],
  doctor: [
    { to: '/doctor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor-appointment', label: 'Appointments', icon: FileText },
    { to: '/doctor-profile', label: 'Profile', icon: User },
  ]
};

const Sidebar = ({ role, open, onClose }) => (
  <>
    {/* Mobile overlay */}
    <div
      className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'block md:hidden' : 'hidden'}`}
      onClick={onClose}
    />

    <div
      className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col py-6 px-4 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:block md:h-full md:z-10`}
      style={{ minHeight: '100vh' }}
    >
      {/* Mobile close button */}
      <button
        className="md:hidden absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X size={20} />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center">
          <Stethoscope size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">
          Medi<span className="text-teal-600">Sync</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {(navItems[role] || []).map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
              }
              onClick={onClose}
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  </>
);

export default Sidebar;