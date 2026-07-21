import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Stethoscope, Brain, Calendar, Shield } from 'lucide-react';

const Banner = () => {
    const navigate = useNavigate();
    const { token, userData } = useContext(AppContext);

    return (
        <div className="flex justify-center items-center my-8 px-4">
            <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl shadow-card-hover overflow-hidden border border-surface-200">

                {/* Left: Text Content */}
                <div className="flex flex-col justify-center items-center md:items-start w-full md:w-1/2 p-10 bg-brand-600">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow-sm text-center md:text-left">
                        Your <span className="text-brand-200">Health</span>,<br />
                        Our <span className="text-brand-100">Priority</span>
                    </h2>
                    <p className="text-md md:text-lg mb-6 text-brand-100 max-w-md text-center md:text-left">
                        Book appointments with top-rated doctors and get the care you deserve. Trusted, compassionate, and always here for you.
                    </p>
                    {!token && !userData && (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-brand-700 hover:bg-brand-50 transition-colors px-8 py-3 rounded-xl font-bold shadow-sm mt-2"
                        >
                            Create Account
                        </button>
                    )}
                </div>

                {/* Right: MediSync Brand Graphic */}
                <div className="flex items-center justify-center w-full md:w-1/2 bg-surface min-h-[220px] p-10">
                    <div className="flex flex-col items-center gap-5">
                        {/* Logo mark */}
                        <div className="w-20 h-20 rounded-3xl bg-brand-600 flex items-center justify-center shadow-brand">
                            <Stethoscope size={40} className="text-white" />
                        </div>

                        {/* Wordmark */}
                        <p className="text-3xl font-bold tracking-tight text-ink">
                            Medi<span className="text-brand-600">Sync</span>
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                            {[
                                { icon: Brain,    label: 'AI Disease Prediction' },
                                { icon: Calendar, label: 'Easy Appointment Booking' },
                                { icon: Shield,   label: 'Secure & Private' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-100 border border-surface-200">
                                    <Icon size={16} className="text-brand-600 flex-shrink-0" />
                                    <span className="text-xs font-medium text-ink-secondary">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
