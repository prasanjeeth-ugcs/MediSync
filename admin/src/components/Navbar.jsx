import React from 'react';
import { Menu, User, LogOut, Stethoscope } from 'lucide-react';

const Navbar = ({ role, onLogout, onMenuClick }) => (
  <header className="bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 py-3 z-20 w-full">
    <div className="flex items-center gap-3">
      {/* Hamburger for mobile */}
      <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} className="text-slate-700" />
      </button>

      <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
        <Stethoscope size={16} className="text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        Medi<span className="text-teal-600">Sync</span>
      </span>
      <span className="hidden sm:inline text-sm font-medium text-slate-400 ml-1">
        {role === 'admin' ? 'Admin Panel' : 'Doctor Panel'}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl capitalize">
        <User size={16} />
        {role}
      </span>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </header>
);

export default Navbar;