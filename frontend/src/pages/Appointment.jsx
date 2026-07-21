import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { GraduationCap, Stethoscope, MapPin, Banknote, Loader2 } from 'lucide-react';

const ALL_TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="card p-10 max-w-xl w-full text-center">
          <h2 className="text-2xl font-bold text-danger mb-4">Something went wrong</h2>
          <p className="text-ink-secondary mb-4">{this.state.error?.message}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const { token, backendurl } = useContext(AppContext);

    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment().toDate());
    const [selectedSlot, setSelectedSlot] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [doctorNotFound, setDoctorNotFound] = useState(false);

    useEffect(() => {
        if (!docId) { setLoading(false); return; }
        const getDoctorDetails = async () => {
            try {
                setDoctorNotFound(false);
                const { data } = await axios.get(`${backendurl}/api/doctor/public/${docId}`);
                if (data.success) setDoctor(data.data);
            } catch (error) {
                if (error?.response?.status === 404) {
                    setDoctor(null); setDoctorNotFound(true);
                    toast.error('This doctor profile no longer exists.');
                } else {
                    toast.error('Failed to load doctor details.');
                }
            } finally { setLoading(false); }
        };
        getDoctorDetails();
    }, [docId, backendurl]);

    useEffect(() => {
        const getAvailability = async () => {
            if (!selectedDate || !docId || doctorNotFound || !doctor?._id) return;
            try {
                const dateStr = moment(selectedDate).format('YYYY-MM-DD');
                const { data } = await axios.get(`${backendurl}/api/doctor/availability/${docId}?date=${dateStr}`);
                if (data.success) setBookedSlots(data.data);
            } catch { toast.error('Could not fetch availability for this date.'); }
        };
        getAvailability();
    }, [selectedDate, docId, backendurl, doctorNotFound, doctor?._id]);

    useEffect(() => {
        const now = moment();
        const isToday = moment(selectedDate).isSame(now, 'day');
        let filtered = ALL_TIME_SLOTS.filter(s => !bookedSlots.includes(s));
        if (isToday) {
            filtered = filtered.filter(slot => {
                const st = moment(slot, 'hh:mm A');
                return moment(selectedDate).set({ hour: st.hours(), minute: st.minutes() }).isAfter(now);
            });
        }
        setAvailableSlots(filtered);
    }, [bookedSlots, selectedDate]);

    const next7Days = Array.from({ length: 7 }, (_, i) => moment().startOf('day').add(i, 'days').toDate());

    const handleBooking = async () => {
        if (!selectedSlot) return toast.error('Please select a time slot.');
        if (!token) return toast.error('Please log in to book an appointment.');
        setBooking(true);
        try {
            const { data } = await axios.post(
                `${backendurl}/api/user/book-appointment`,
                { docId: doctor._id, slotDate: moment(selectedDate).format('YYYY-MM-DD'), slotTime: selectedSlot, amount: doctor.fees },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                const payment = await axios.post(
                    `${backendurl}/api/user/create-stripe-session`,
                    { appointmentId: data.appointmentId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (payment.data?.success && payment.data?.url) window.location.href = payment.data.url;
                else {
                    toast.error('Could not initiate payment. Please try again.');
                    try { await axios.post(`${backendurl}/api/user/cancel-appointment/${data.appointmentId}`, {}, { headers: { Authorization: `Bearer ${token}` } }); } catch {}
                }
            } else { toast.error(data.message || 'Failed to reserve slot.'); }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally { setBooking(false); }
    };

    if (!docId) return <div className="text-center p-8 text-danger font-bold">Invalid doctor link.</div>;
    if (loading) return <Spinner />;
    if (doctorNotFound) return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center">
            <div className="card p-10 text-center max-w-md">
                <p className="text-ink-secondary font-medium mb-4">Doctor not found. This profile may have been removed.</p>
                <button onClick={() => navigate('/doctors')} className="btn-primary">Browse Doctors</button>
            </div>
        </div>
    );
    if (!doctor) return <div className="text-center p-8 text-ink-muted">Doctor not found.</div>;

    const d = doctor;

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-surface-50 py-10 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="card overflow-hidden md:flex shadow-card-hover">
                        {/* ─── Left: Doctor info ─── */}
                        <div className="md:w-1/3 p-8 bg-brand-600 text-white flex flex-col items-center">
                            <img src={d.image || ''} alt={d.fullName || 'Doctor'}
                                className="w-28 h-28 rounded-full object-cover border-4 border-white/30 shadow-lg mb-4" />
                            <h1 className="text-2xl font-bold text-center">{d.fullName}</h1>
                            <p className="text-brand-200 text-sm mt-1 text-center">{d.specialization || d.speciality}</p>

                            <div className="mt-6 space-y-3 w-full">
                                {[
                                    { icon: GraduationCap, label: d.degree || 'N/A' },
                                    { icon: Stethoscope,   label: `${d.experience || 'N/A'} experience` },
                                    { icon: MapPin,        label: d.address || 'N/A' },
                                    { icon: Banknote,      label: `₹${d.fees || 'N/A'} per session` },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-3 text-sm text-brand-100">
                                        <Icon size={16} className="text-brand-300 flex-shrink-0" />
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>

                            {d.about && (
                                <div className="mt-6 pt-5 border-t border-white/20 w-full">
                                    <p className="text-xs text-brand-200 leading-relaxed">{d.about}</p>
                                </div>
                            )}
                        </div>

                        {/* ─── Right: Booking ─── */}
                        <div className="md:w-2/3 p-8">
                            <h2 className="text-xl font-bold text-ink mb-5">Book Your Appointment</h2>

                            {/* Date picker */}
                            <div className="mb-6">
                                <label className="label mb-2">Select Date</label>
                                <div className="flex gap-2 flex-wrap">
                                    {next7Days.map(date => (
                                        <button
                                            key={date.toString()}
                                            onClick={() => { setSelectedDate(date); setSelectedSlot(''); }}
                                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                                moment(selectedDate).isSame(date, 'day')
                                                    ? 'bg-brand-600 text-white border-brand-600 shadow-brand'
                                                    : 'bg-surface border-surface-200 text-ink-secondary hover:border-brand-300 hover:text-brand-600'
                                            }`}
                                        >
                                            {moment(date).format('ddd, MMM D')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time slots */}
                            <div className="mb-6">
                                <label className="label mb-2">
                                    Available Slots — <span className="text-brand-600 font-semibold">{moment(selectedDate).format('MMMM Do, YYYY')}</span>
                                </label>
                                {availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                                                    selectedSlot === slot
                                                        ? 'bg-brand-600 text-white border-brand-600 shadow-brand'
                                                        : 'bg-surface border-surface-200 text-ink-secondary hover:border-brand-300 hover:text-brand-600'
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-ink-muted">No available slots for this day. Please select another date.</p>
                                )}
                            </div>

                            <div className="divider mb-6" />

                            <button
                                onClick={handleBooking}
                                disabled={booking || !selectedSlot}
                                className="btn-primary btn-lg w-full"
                            >
                                {booking ? <><Loader2 size={16} className="animate-spin" /> Booking…</> : 'Confirm & Pay'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Appointment;
