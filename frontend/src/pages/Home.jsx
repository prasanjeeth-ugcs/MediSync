import React from 'react';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';
import { useNavigate } from 'react-router-dom';
import { Calendar, Brain, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Disease Prediction',
    desc: 'Instantly analyze your symptoms and get accurate AI-powered health insights.',
    color: 'text-brand-600',
    bg: 'bg-brand-50',
  },
  {
    icon: Calendar,
    title: 'Seamless Booking',
    desc: 'Book appointments with top-rated doctors in just a few clicks.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your health data is encrypted and handled with the highest confidentiality.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col w-full">
      {/* ─── Hero ─── */}
      <section className="w-full bg-surface border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 flex flex-col items-start gap-6 animate-fade-up">
            <span className="badge-brand text-xs font-semibold px-3 py-1">
              🏥 AI-Powered Healthcare Platform
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-ink leading-tight">
              Welcome to{' '}
              <span className="text-brand-600">MediSync</span>
            </h1>
            <p className="text-lg text-ink-secondary max-w-xl leading-relaxed">
              Book appointments with top doctors and use our AI-powered disease
              prediction tool for instant, personalized health insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => navigate('/doctors')}
                className="btn-primary btn-lg"
              >
                Find Doctors
              </button>
              <button
                onClick={() => navigate('/disease-prediction')}
                className="btn-secondary btn-lg"
              >
                AI Prediction
              </button>
            </div>
          </div>

          {/* Right — Stats card */}
          <div className="flex-1 flex justify-center">
            <div className="card p-8 w-full max-w-sm shadow-card-hover">
              <h3 className="text-lg font-semibold text-ink mb-6">Platform at a glance</h3>
              {[
                { label: 'Verified Doctors',     value: '200+' },
                { label: 'Appointments Booked',  value: '10k+' },
                { label: 'Specialties Covered',  value: '20+'  },
                { label: 'AI Predictions Made',  value: '5k+'  },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-surface-200 last:border-0">
                  <span className="text-sm text-ink-secondary">{label}</span>
                  <span className="text-sm font-bold text-brand-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="w-full py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Why MediSync</p>
            <h2 className="text-3xl font-bold text-ink">Built for your health</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card p-6 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                  <Icon size={24} className={color} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Top Doctors ─── */}
      <section className="w-full bg-surface border-y border-surface-200">
        <div className="max-w-7xl mx-auto">
          <TopDoctors />
        </div>
      </section>

      {/* ─── Speciality Menu ─── */}
      <section className="w-full bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <SpecialityMenu />
        </div>
      </section>

      {/* ─── Banner (CTA) ─── */}
      <section className="w-full bg-surface border-t border-surface-200">
        <div className="max-w-7xl mx-auto">
          <Banner />
        </div>
      </section>
    </div>
  );
};

export default Home;
