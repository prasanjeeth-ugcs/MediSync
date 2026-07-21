import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../context/AppContext';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Ban } from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    title: 'Verifying your payment…',
    message: 'Please wait while we confirm your transaction.',
    icon: Loader2,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    spin: true,
  },
  success: {
    title: 'Payment Successful!',
    message: 'Your appointment has been confirmed.',
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-emerald-50',
  },
  failed: {
    title: 'Payment Verification Failed',
    message: 'We could not verify your payment. Please contact support.',
    icon: XCircle,
    color: 'text-danger',
    bg: 'bg-red-50',
  },
  cancelled: {
    title: 'Payment Cancelled',
    message: 'You cancelled the payment. No appointment was booked.',
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-amber-50',
  },
  invalid: {
    title: 'Invalid Request',
    message: 'Missing or invalid payment information.',
    icon: Ban,
    color: 'text-ink-muted',
    bg: 'bg-surface-100',
  },
};

const Verify = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const query = new URLSearchParams(search);
  const appointmentId = query.get('appointmentId');
  const success = query.get('success');

  const [status, setStatus] = useState('pending');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!appointmentId) { setStatus('invalid'); return; }
    if (success === 'true') {
      const check = async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/appointment/${appointmentId}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          const appt = data.appointment;
          if (appt && appt.paymentStatus === 'paid' && !appt.cancelled) {
            setStatus('success'); toast.success('Appointment confirmed!');
          } else if (appt?.cancelled) {
            setStatus('cancelled'); toast.error('This appointment was cancelled.');
          } else {
            setStatus('failed'); toast.error('Payment verification failed.');
          }
        } catch { setStatus('failed'); toast.error('Could not verify payment status.'); }
      };
      check();
    } else if (success === 'false') {
      setStatus('cancelled');
    } else {
      setStatus('invalid');
    }
  }, [appointmentId, success, token]);

  useEffect(() => {
    if (status !== 'success') return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); navigate('/my-appointments'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, navigate]);

  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <ToastContainer />
      <div className="card p-10 w-full max-w-md flex flex-col items-center text-center shadow-card-hover">
        <div className={`w-16 h-16 rounded-2xl ${cfg.bg} flex items-center justify-center mb-5`}>
          <Icon size={32} className={`${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`} />
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${cfg.color}`}>{cfg.title}</h2>
        <p className="text-sm text-ink-secondary leading-relaxed">{cfg.message}</p>

        {status === 'success' && (
          <p className="mt-3 text-xs text-ink-muted">
            Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}…
          </p>
        )}

        <div className="mt-8 flex flex-col gap-2 w-full">
          <Link to="/my-appointments" className="btn-primary w-full justify-center">
            My Appointments
          </Link>
          <Link to="/" className="btn-ghost w-full justify-center text-ink-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;