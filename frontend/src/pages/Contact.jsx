import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

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

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-surface-50 w-full">
      {/* Hero */}
      <section className="bg-surface border-b border-surface-200 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-2">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Contact <span className="text-brand-600">Us</span>
          </h1>
          <p className="text-lg text-ink-secondary">
            Have questions? Fill out the form or reach us directly.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Form */}
          <div className="card p-8">
            <h2 className="text-lg font-semibold text-ink mb-6">Send a message</h2>

            {submitted && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
                ✓ Message sent! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="label">Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="John Doe" required className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@example.com" required className="input" />
              </div>
              <div>
                <label className="label">Phone (optional)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+1 234 567 8901" className="input" />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange}
                  placeholder="How can we help you?" rows={4} required
                  className="input resize-none" />
              </div>
              <button type="submit" className="btn-primary btn-lg mt-1">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-5">
            {[
              { icon: Mail,    label: 'Email',   value: 'support@medisync.com' },
              { icon: Phone,   label: 'Phone',   value: '+1 234 567 8901' },
              { icon: MapPin,  label: 'Address', value: '123 Health Street, Medical City' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-6 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm font-medium text-ink">{value}</p>
                </div>
              </div>
            ))}

            <div className="card p-6 bg-brand-50 border-brand-100">
              <h3 className="text-sm font-semibold text-brand-700 mb-2">Office Hours</h3>
              <p className="text-sm text-brand-600">Monday – Friday: 9am – 6pm</p>
              <p className="text-sm text-brand-600">Saturday: 10am – 2pm</p>
              <p className="text-sm text-brand-400">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactPage = (props) => (
  <ErrorBoundary><Contact {...props} /></ErrorBoundary>
);

export default ContactPage;
