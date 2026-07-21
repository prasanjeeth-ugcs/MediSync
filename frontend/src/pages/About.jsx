import React from 'react';
import { Stethoscope, Brain, Star, Shield, Calendar } from 'lucide-react';

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

const features = [
  { icon: Brain,    title: 'AI-Powered Disease Detection',        desc: 'Instantly analyze your symptoms and get accurate disease predictions powered by Gemini AI.' },
  { icon: Star,     title: 'Personalized Doctor Recommendations', desc: 'Find the right specialists based on your diagnosis, location, and availability.' },
  { icon: Calendar, title: 'Seamless Appointment Booking',        desc: 'Book slots with top doctors in just a few clicks — no waiting, no hassle.' },
  { icon: Shield,   title: 'Secure & Private',                    desc: 'Your health data is encrypted and handled with the highest level of confidentiality.' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-surface-50 w-full">
      {/* Hero */}
      <section className="bg-surface border-b border-surface-200 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-brand">
              <Stethoscope size={32} className="text-white" />
            </div>
          </div>
          <p className="section-label mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            About <span className="text-brand-600">MediSync</span>
          </h1>
          <p className="text-lg text-ink-secondary leading-relaxed max-w-2xl mx-auto">
            MediSync is a modern healthcare platform that makes healthcare accessible and efficient.
            Book appointments with top doctors and use our AI-powered disease prediction tool for instant insights.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-label mb-2">What We Offer</p>
            <h2 className="text-3xl font-bold text-ink">Platform Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Why Choose MediSync?</h2>
          <p className="text-brand-100 mb-6 leading-relaxed">
            Our platform combines advanced AI with a user-friendly interface to empower you
            to take control of your health journey. Fast, easy, and reliable.
          </p>
          <p className="text-brand-200 font-semibold text-lg">
            Start your path to better health today.
          </p>
        </div>
      </section>
    </div>
  );
};

const AboutPage = (props) => (
  <ErrorBoundary><About {...props} /></ErrorBoundary>
);

export default AboutPage;
