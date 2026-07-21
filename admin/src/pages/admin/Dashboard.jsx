import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { AdminContext } from '../../context/Admincontext';
import { Link } from 'react-router-dom';
import { Users, CalendarDays, TrendingUp, Megaphone } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Dashboard = () => {
  const { aToken } = useContext(AdminContext);
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${aToken}` },
        });
        setStats({
          doctors: data.data?.totalDoctors || 0,
          patients: data.data?.totalPatients || 0,
          appointments: data.data?.totalAppointments || 0,
          earnings: data.data?.totalEarnings || 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
      } finally { setLoading(false); }
    };
    if (aToken) fetchStats();
  }, [aToken]);

  const statCards = [
    { label: 'Doctors',      value: stats.doctors,      icon: Users,        color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Appointments', value: stats.appointments,  icon: CalendarDays, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{label}</p>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? <Spinner /> : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Announcements */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={18} className="text-teal-600" />
            <h2 className="text-base font-semibold text-slate-900">Announcements</h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between items-start">
              <span>New doctor onboarding process launched.</span>
              <span className="text-xs text-slate-400 ml-2 flex-shrink-0">Jun 2024</span>
            </li>
            <li className="flex justify-between items-start">
              <span>Performance improvements deployed.</span>
              <span className="text-xs text-slate-400 ml-2 flex-shrink-0">May 2024</span>
            </li>
            <li className="flex justify-between items-start">
              <span>Article management now supports images.</span>
              <span className="text-xs text-slate-400 ml-2 flex-shrink-0">Apr 2024</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-teal-600" />
            <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <Link to="/doctor-list" className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors">
              View Doctors
            </Link>
            <Link to="/add-doctor" className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors">
              Add Doctor
            </Link>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Tips</h3>
          <ul className="space-y-1.5 text-sm text-slate-500">
            <li>• Regularly review doctor profiles for accuracy.</li>
            <li>• Encourage doctors to keep availability up to date.</li>
          </ul>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm font-medium text-center mt-6 bg-red-50 rounded-xl p-3">{error}</div>}
    </div>
  );
};

export default Dashboard;