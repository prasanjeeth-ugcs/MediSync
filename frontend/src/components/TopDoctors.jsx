import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    return (
        <section className="w-full py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <p className="section-label mb-2">Our Best</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-ink">
                        Top <span className="text-brand-600">Doctors</span>
                    </h2>
                    <p className="mt-3 text-ink-secondary text-base">
                        Book appointments with trusted, highly-rated professionals.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {doctors.slice(0, 6).map((doc) => (
                        <div
                            key={doc._id}
                            className="card-hover p-6 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1"
                        >
                            <img
                                src={doc.image}
                                alt={doc.fullName}
                                className="w-20 h-20 object-cover rounded-full mb-4 border-2 border-brand-100 shadow-sm"
                            />
                            <div className="mb-1">
                                <span className="badge-success text-xs">Available</span>
                            </div>
                            <h3 className="text-base font-semibold text-ink mt-2">{doc.fullName}</h3>
                            <p className="text-sm text-brand-600 font-medium mt-0.5">{doc.speciality}</p>
                            <button
                                onClick={() => navigate(`/appointment/${doc._id}`)}
                                className="mt-4 btn-primary w-full"
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate('/doctors')}
                        className="btn-secondary"
                    >
                        View all doctors
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TopDoctors;
