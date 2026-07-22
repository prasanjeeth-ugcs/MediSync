import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/Admincontext';
import { DoctorContext } from '../context/Doctorcontext';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const endpoint = `${import.meta.env.VITE_BACKEND_URL}${role === 'admin' ? '/api/admin/login' : '/api/doctor/login'}`;
      const { data } = await axios.post(endpoint, { email, password });
      if (data.success && data.token) {
        if (role === 'admin') {
          setAToken(data.token);
          localStorage.setItem('admin_token', data.token);
          navigate('/admin-dashboard');
        } else {
          setDToken(data.token);
          navigate('/doctor-dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-sm">
            <Stethoscope size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Medi<span className="text-teal-600">Sync</span>
          </span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6 text-center">Sign in to manage MediSync</p>

          {/* Role toggle */}
          <div className="flex w-full mb-6 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${role === 'admin'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
            <button
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${role === 'doctor'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setRole('doctor')}
            >
              Doctor
            </button>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full p-3 pr-11 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-sm mt-1"
              disabled={loading}
            >
              {loading ? 'Signing in…' : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;