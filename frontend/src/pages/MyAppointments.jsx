import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { Loader2, CalendarDays, CreditCard, X } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const MyAppointments = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchAppointments(); }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('success')) {
      fetchAppointments();
      params.get('success') === 'true'
        ? toast.success('Payment successful! Your appointment is confirmed.')
        : toast.error('Payment was not completed.');
      navigate('/my-appointments', { replace: true });
    }
  }, [location.search]);

  const cancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment/${id}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) { toast.success(data.message || 'Appointment cancelled.'); fetchAppointments(); }
      else toast.error(data.message || 'Failed to cancel appointment');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel appointment'); }
  };

  const handlePayOnline = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/create-stripe-session`, { appointmentId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success && data.url) window.location.href = data.url;
      else toast.error('Could not initiate payment');
    } catch (err) { toast.error(err.response?.data?.message || 'Payment processing failed'); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const parseDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    let [time, mod] = timeStr.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (mod === 'PM' && h !== 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;
    return new Date(year, month - 1, day, h, m);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 size={32} className="animate-spin text-brand-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 w-full py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-ink mb-6">My Appointments</h1>

        {error ? (
          <div className="card p-6 text-center text-danger">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="card p-12 text-center">
            <CalendarDays size={40} className="mx-auto text-ink-muted mb-4" />
            <p className="text-base font-medium text-ink-secondary">No appointments yet.</p>
            <button onClick={() => navigate('/doctors')} className="btn-primary mt-4">
              Find Doctors
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments
              .slice()
              .sort((a, b) => parseDateTime(a.slotDate, a.slotTime) - parseDateTime(b.slotDate, b.slotTime))
              .map((app) => {
                const doc = app.docData || {};
                const isPaid = app.paymentStatus === 'paid';
                const isCancelled = app.cancelled;
                const isCompleted = isPaid && app.isCompleted;
                const isPast = parseDateTime(app.slotDate, app.slotTime) < new Date();

                return (
                  <div
                    key={app._id}
                    className={`card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-opacity ${isCancelled || (isPast && !isCompleted) ? 'opacity-60' : ''}`}
                  >
                    {/* Doctor image */}
                    <img
                      src={doc.image || assets.logo || ''}
                      alt={doc.fullName || 'Doctor'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-brand-100 shadow-sm flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-ink truncate">{doc.fullName || 'Doctor'}</h2>
                      <p className="text-sm text-brand-600 font-medium">{doc.specialization || doc.speciality}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                          <CalendarDays size={13} />
                          {formatDate(app.slotDate)} · {app.slotTime}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                          <CreditCard size={13} />
                          ₹{app.amount}
                        </div>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2 items-center">
                      {isCompleted
                        ? <span className="badge bg-brand-50 text-brand-700">Completed</span>
                        : isPaid
                        ? <span className="badge-success">Paid</span>
                        : <span className="badge-warning">Pending</span>
                      }
                      {isCancelled
                        ? <span className="badge-danger">Cancelled</span>
                        : isPast && !isCompleted
                        ? <span className="badge bg-surface-200 text-ink-muted">Expired</span>
                        : <span className="badge-brand">Active</span>
                      }
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[100px]">
                      {!isCancelled && !isPaid && !isPast && (
                        <button onClick={() => handlePayOnline(app._id)} className="btn-primary text-xs px-3 py-1.5">
                          Pay Now
                        </button>
                      )}
                      {!isCancelled && !isPaid && !isPast && (
                        <button onClick={() => cancelAppointment(app._id)} className="btn-danger text-xs px-3 py-1.5">
                          <X size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;