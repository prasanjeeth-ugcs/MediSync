import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { DoctorContext } from '../../context/Doctorcontext';
import { CalendarDays, Users, BadgeDollarSign, Clock } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const DoctorDashboard = () => {
  const { dToken } = useContext(DoctorContext);
  const [stats, setStats] = useState({ appointments: 0, earnings: 0, patients: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
          headers: { Authorization: `Bearer ${dToken}` },
        });
        setStats({
          appointments: data.data?.totalAppointments || 0,
          earnings: data.data?.totalEarnings || 0,
          patients: data.data?.totalPatients || 0,
        });
        setUpcoming(data.data?.upcomingAppointments || []);
      } catch (err) { setError(err.response?.data?.message || 'Failed to fetch dashboard stats'); }
      finally { setLoading(false); }
    };
    if (dToken) fetchStats();
  }, [dToken]);

  const statCards = [
    { label: 'Appointments', value: stats.appointments, icon: CalendarDays, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Patients',     value: stats.patients,     icon: Users,        color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Earnings',     value: `₹${Number(stats.earnings).toLocaleString('en-IN')}`, icon: BadgeDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-slate-900">{loading ? <Spinner /> : value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Appointments */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-teal-600" />
            <h2 className="text-base font-semibold text-slate-900">Upcoming Appointments</h2>
          </div>
          {loading ? <Spinner /> : upcoming.length === 0 ? (
            <p className="text-sm text-slate-400">No upcoming appointments.</p>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {upcoming.slice(0, 4).map((app, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-800">{app.patientName || 'Patient'}</span>
                  <span className="text-xs text-slate-500">{app.date} · {app.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Welcome to MediSync!</h2>
          <p className="text-sm text-slate-500 mb-4">Manage your appointments, patients, and profile from this dashboard.</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>• Mark appointments completed after each session.</li>
            <li>• Keep your profile updated so patients can find you.</li>
            <li>• Review your earnings and stats regularly.</li>
          </ul>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-3 mt-6">{error}</div>}
    </div>
  );
};

export default DoctorDashboard;