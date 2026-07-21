import React, { useState, useEffect, useContext } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { AdminContext } from '../../context/Admincontext';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const DoctorsList = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const { aToken } = useContext(AdminContext);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      setDoctors(data.data || []);
    } catch (err) { setError(err.response?.data?.message || 'Failed to fetch doctors'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (aToken) fetchDoctors(); }, [aToken]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${backendUrl}/api/admin/delete-doctor/${id}`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      await fetchDoctors();
    } catch (err) { setError(err.response?.data?.message || 'Failed to delete doctor'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Doctors List</h1>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : error ? (
        <div className="card p-6 text-center text-red-500 text-sm">{error}</div>
      ) : doctors.length === 0 ? (
        <div className="card p-12 text-center text-slate-400 text-sm">No doctors found. Add one to get started.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {doctors.map(doc => (
              <div key={doc._id} className="card p-4 flex gap-4">
                <img src={doc.image} alt={doc.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{doc.fullName}</p>
                  <p className="text-sm text-teal-600 font-medium">{doc.speciality}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.degree} · ₹{doc.fees}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {doc.available
                      ? <><CheckCircle size={12} className="text-emerald-500" /><span className="text-xs text-emerald-600">Available</span></>
                      : <><XCircle size={12} className="text-slate-400" /><span className="text-xs text-slate-400">Unavailable</span></>
                    }
                  </div>
                </div>
                <button onClick={() => handleDelete(doc._id)} disabled={deletingId === doc._id}
                  className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors self-start flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Photo', 'Name', 'Email', 'Speciality', 'Degree', 'Exp.', 'Fees', 'Available', ''].map(h => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map(doc => (
                  <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <img src={doc.image} alt={doc.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-100" />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">{doc.fullName}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{doc.email}</td>
                    <td className="py-3 px-4 text-teal-600 font-medium whitespace-nowrap">{doc.speciality}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{doc.degree}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{doc.experience} yrs</td>
                    <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">₹{doc.fees}</td>
                    <td className="py-3 px-4">
                      {doc.available
                        ? <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle size={10} />Yes</span>
                        : <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full"><XCircle size={10} />No</span>
                      }
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(doc._id)} disabled={deletingId === doc._id}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorsList;