import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { Camera, X, AlertTriangle, Loader2, Brain, Stethoscope, ShieldCheck, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const DiseasePrediction = () => {
    const { backendurl, token } = useContext(AppContext);
    const [symptoms, setSymptoms] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        if (!symptoms.trim() && !image) return toast.error('Please enter symptoms or upload an image.');
        setLoading(true); setPrediction(null);
        const formData = new FormData();
        formData.append('symptoms', symptoms);
        if (image) formData.append('image', image);
        try {
            const response = await axios.post(`${backendurl}/api/user/disease-prediction`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) setPrediction(response.data.data);
            else toast.error(response.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred.');
        } finally { setLoading(false); }
    };

    let disclaimer = '', specialist = null, causesList = [], preventionList = [];
    if (prediction) {
        if (prediction.raw) {
            disclaimer = 'This is an AI-generated suggestion. Please consult a real doctor.';
            specialist = { name: 'Specialist', reason: 'Consult a specialist for your symptoms.' };
        } else {
            disclaimer = prediction.disclaimer || 'This is an AI-generated suggestion. Please consult a real doctor.';
            specialist = prediction.specialist || null;
            causesList = Array.isArray(prediction.causes) ? prediction.causes : [];
            preventionList = Array.isArray(prediction.prevention) ? prediction.prevention : [];
        }
    }

    return (
        <ErrorBoundary>
        <div className="min-h-screen bg-surface-50 w-full py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* ─── Header ─── */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-brand">
                            <Brain size={28} className="text-white" />
                        </div>
                    </div>
                    <p className="section-label mb-2">Powered by Gemini AI</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-ink">AI Symptom Analysis</h1>
                    <p className="mt-2 text-ink-secondary">
                        AI-assisted preliminary assessment — not a substitute for professional medical advice.
                    </p>
                </div>

                {/* ─── Input Form ─── */}
                <div className="card p-8 mb-8 shadow-card-hover">
                    <form onSubmit={handlePredict} className="w-full flex flex-col gap-6">
                        <div>
                            <label className="label text-base">Describe Your Symptoms</label>
                            <textarea
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="input resize-none"
                                rows={5}
                                placeholder="Example: I have a persistent headache for 3 days, accompanied by dizziness and sensitivity to light…"
                            />
                        </div>

                        <div>
                            <label className="label">Upload Medical Image (Optional)</label>
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => fileInputRef.current.click()} className="btn-secondary gap-2">
                                    <Camera size={16} /> Choose Image
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                                {imagePreview && (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-xl object-cover border-2 border-surface-200 shadow-sm" />
                                        <button type="button" onClick={() => { setImage(null); setImagePreview(''); fileInputRef.current.value = null; }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-danger rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors">
                                            <X size={10} className="text-white" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary btn-lg self-center px-16">
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : 'Analyze Symptoms'}
                        </button>
                    </form>
                </div>

                {/* ─── Results ─── */}
                {prediction && (
                    <div className="flex flex-col gap-5 animate-fade-up">
                        {/* Condition */}
                        {prediction.disease_name && prediction.disease_name !== 'Analysis Unavailable' && (
                            <div className="card p-6 border-l-4 border-brand-600">
                                <div className="flex items-center gap-3 mb-2">
                                    <Stethoscope size={20} className="text-brand-600" />
                                    <h2 className="text-lg font-bold text-ink">Identified Condition</h2>
                                </div>
                                <p className="text-xl font-bold text-brand-600 mb-2">{prediction.disease_name}</p>
                                {prediction.disease_description && (
                                    <p className="text-sm text-ink-secondary leading-relaxed">{prediction.disease_description}</p>
                                )}
                            </div>
                        )}

                        {/* Causes */}
                        {causesList.length > 0 && (
                            <div className="card p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <ListChecks size={20} className="text-brand-600" />
                                    <h3 className="text-base font-bold text-ink">Common Causes</h3>
                                </div>
                                <ul className="space-y-2">
                                    {causesList.map((cause, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-ink-secondary">
                                            <span className="text-brand-500 font-bold flex-shrink-0">•</span>
                                            <span>{cause}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Prevention */}
                        {preventionList.length > 0 && (
                            <div className="card p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <ShieldCheck size={20} className="text-success" />
                                    <h3 className="text-base font-bold text-ink">Recommended Precautions</h3>
                                </div>
                                <ul className="space-y-2">
                                    {preventionList.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-ink-secondary">
                                            <span className="text-success font-bold flex-shrink-0">✓</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Specialist */}
                        {specialist?.name && (
                            <div className="card p-6 bg-brand-600 border-0 text-white">
                                <h3 className="text-base font-bold mb-2">Recommended Specialist</h3>
                                <p className="text-lg font-bold text-brand-100 mb-1">{specialist.name}</p>
                                <p className="text-sm text-brand-200 mb-5">{specialist.reason}</p>
                                <button
                                    onClick={() => navigate(`/doctors/${specialist.name}`)}
                                    className="bg-white text-brand-700 font-bold py-2.5 px-8 rounded-xl hover:bg-brand-50 transition-colors shadow-sm text-sm"
                                >
                                    Find a {specialist.name}
                                </button>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="card p-5 border-l-4 border-warning bg-amber-50">
                            <div className="flex gap-3">
                                <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-bold text-amber-900 mb-1">Important Medical Disclaimer</h3>
                                    <p className="text-sm text-amber-800 leading-relaxed">{disclaimer}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </ErrorBoundary>
    );
};

export default DiseasePrediction;
