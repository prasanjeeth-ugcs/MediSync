import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50">
          <div className="card p-10 max-w-xl w-full text-center">
            <h2 className="text-2xl font-bold text-danger mb-4">Something went wrong</h2>
            <p className="text-ink-secondary mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', fullName: '', password: '' });
  const { backendurl, token, setToken, setUserId } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsRegister(location.pathname === '/register');
  }, [location.pathname]);

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const endpoint = isRegister ? 'register' : 'login';
    const url = `${backendurl}/api/user/${endpoint}`;
    const payload = isRegister
      ? { email: form.email, fullName: form.fullName, password: form.password }
      : { email: form.email, password: form.password };

    try {
      const { data } = await axios.post(url, payload);
      if (data?.success) {
        setSuccess(data.message || 'Success!');
        if (!isRegister) {
          setToken(data.token);
          let userId = data.userId;
          if (!userId && data.token) {
            try { userId = jwtDecode(data.token).id; } catch {}
          }
          setUserId(userId);
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', userId);
        } else {
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        setError(data?.message || 'Operation failed');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center w-full py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
            <Stethoscope size={20} className="text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-ink">
            Medi<span className="text-brand-600">Sync</span>
          </span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink mb-1">
            {isRegister ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-ink-secondary mb-6">
            {isRegister
              ? 'Sign up to start booking appointments'
              : 'Sign in to your MediSync account'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <div>
                <label className="label">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="John Doe"
                  required
                  className="input"
                />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error   && <p className="text-sm text-danger bg-red-50 rounded-xl px-4 py-2">{error}</p>}
            {success && <p className="text-sm text-success bg-emerald-50 rounded-xl px-4 py-2">{success}</p>}

            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full mt-1">
              {loading ? 'Please wait…' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-secondary text-center">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              to={isRegister ? '/login' : '/register'}
              className="text-brand-600 hover:text-brand-700 font-semibold transition-colors"
            >
              {isRegister ? 'Sign In' : 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginPage = (props) => (
  <ErrorBoundary><Login {...props} /></ErrorBoundary>
);

export default LoginPage;
