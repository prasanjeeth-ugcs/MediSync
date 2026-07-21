import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/Admincontext';
import { User, Mail } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Profile = () => {
  const { aToken } = useContext(AdminContext);
  const [profile, setProfile] = useState({ fullName: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${aToken}` },
        });
        setProfile({ fullName: data.name || 'Admin', email: data.email || '' });
      } catch (err) { setError(err.response?.data?.message || 'Failed to fetch profile'); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [aToken]);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Profile</h1>
      <div className="card p-8">
        {loading ? (
          <div className="text-center text-slate-500 text-sm py-8">Loading…</div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-4">{error}</div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-teal-100 flex items-center justify-center">
              <User size={36} className="text-teal-600" />
            </div>

            <div className="w-full flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  <User size={15} className="text-slate-400" /> {profile.fullName}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  <Mail size={15} className="text-slate-400" /> {profile.email}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center">Profile editing is not supported for admin accounts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;