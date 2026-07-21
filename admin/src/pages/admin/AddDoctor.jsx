import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/Admincontext';
import { Upload, Loader2 } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const FIELD_INPUT = 'w-full p-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition';

const AddDoctor = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', speciality: '', degree: '',
    experience: '', about: '', fees: '', address: '', available: 'yes', image: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { aToken } = useContext(AdminContext);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image' && !value) return;
        formData.append(key, value);
      });
      formData.set('available', form.available === 'yes');
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${aToken}` },
      });
      if (data.success) {
        setSuccess('Doctor added successfully!');
        setForm({ fullName: '', email: '', password: '', speciality: '', degree: '', experience: '', about: '', fees: '', address: '', available: 'yes', image: null });
      } else { setError(data.message || 'Failed to add doctor'); }
    } catch (err) { setError(err.response?.data?.message || 'Failed to add doctor'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add Doctor</h1>
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Dr. John Smith" required className={FIELD_INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Email *</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="doctor@example.com" type="email" required className={FIELD_INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Password *</label>
              <input name="password" value={form.password} onChange={handleChange} placeholder="••••••••" type="password" required className={FIELD_INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Speciality *</label>
              <input name="speciality" value={form.speciality} onChange={handleChange} placeholder="Cardiologist" required className={FIELD_INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Degree *</label>
              <input name="degree" value={form.degree} onChange={handleChange} placeholder="MBBS, MD" required className={FIELD_INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Experience (years) *</label>
              <input name="experience" value={form.experience} onChange={handleChange} placeholder="5" type="number" min="0" required className={FIELD_INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Fees (₹) *</label>
              <input name="fees" value={form.fees} onChange={handleChange} placeholder="500" type="number" min="0" required className={FIELD_INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Address *</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="123 Medical St." required className={FIELD_INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Availability</label>
              <select name="available" value={form.available} onChange={handleChange} className={FIELD_INPUT} required>
                <option value="yes">Available</option>
                <option value="no">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Profile Photo</label>
              <label className="flex items-center gap-2 cursor-pointer w-full p-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-500 hover:border-teal-400 transition">
                <Upload size={16} className="text-teal-500" />
                {form.image ? form.image.name : 'Choose image…'}
                <input name="image" onChange={handleChange} type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">About *</label>
            <textarea name="about" value={form.about} onChange={handleChange} placeholder="Brief description of the doctor's expertise…" required className={`${FIELD_INPUT} resize-none`} rows={3} />
          </div>

          {success && <div className="text-sm text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2">{success}</div>}
          {error   && <div className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</div>}

          <button type="submit" className="btn-primary py-3 text-sm flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Adding…</> : 'Add Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;