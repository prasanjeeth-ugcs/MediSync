import React from 'react';
import { useNavigate } from 'react-router-dom';
import { specialityData } from '../assets/assets';

const SpecialityMenu = () => {
    const navigate = useNavigate();
    return (
        <section className="w-full flex flex-col items-center py-12 px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
                <p className="section-label mb-2">Browse by Category</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-ink">
                    Find by <span className="text-brand-600">Specialty</span>
                </h2>
                <p className="mt-3 text-ink-secondary text-base">
                    Browse our trusted specialists and pick the perfect one for you.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-5xl">
                {specialityData.slice(0, 6).map((item, index) => (
                    <div
                        key={item.speciality || index}
                        onClick={() => navigate(`/doctors/${encodeURIComponent(item.speciality)}`)}
                        className="card-hover flex flex-col items-center p-5 transition-all duration-200 hover:-translate-y-1"
                        aria-label={`View doctors for ${item.speciality}`}
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-brand-100 bg-brand-50 flex items-center justify-center mb-3">
                            <img
                                src={item.image}
                                alt={item.speciality}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-sm font-semibold text-ink text-center leading-tight">
                            {item.speciality}
                        </p>
                    </div>
                ))}
            </div>

            <button
                onClick={() => navigate('/doctors')}
                className="mt-8 btn-ghost text-brand-600 hover:text-brand-700 font-semibold text-sm"
            >
                View all specialties →
            </button>
        </section>
    );
};

export default SpecialityMenu;
