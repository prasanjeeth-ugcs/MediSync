import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { Camera, Loader2 } from 'lucide-react';

const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;

const readImageDimensions = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.width, height: img.height, img }); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Invalid image file')); };
    img.src = url;
  });

const compressImage = async (file) => {
  const { width, height, img } = await readImageDimensions(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth; canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Image processing not supported in this browser.');
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  let quality = 0.85;
  let compressed = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  while (compressed && compressed.size > MAX_UPLOAD_BYTES && quality > 0.45) {
    quality -= 0.1;
    compressed = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  }
  if (!compressed) throw new Error('Could not process image.');
  return new File([compressed], `profile-${Date.now()}.jpg`, { type: 'image/jpeg' });
};

const Myprofile = () => {
  const { userData, setUserData, backendurl, token } = useContext(AppContext);
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setProfile({
        fullName:     userData.fullName || '',
        email:        userData.email || '',
        phone:        userData.phone || '',
        address:      userData.address || '',
        gender:       userData.gender || 'Male',
        dob:          userData.dob ? userData.dob.split('T')[0] : '',
        profileImage: userData.image || 'https://i.pravatar.cc/160',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file.'); return; }
    let finalFile = file;
    if (file.size > MAX_UPLOAD_BYTES) {
      try { finalFile = await compressImage(file); } catch (err) { toast.error(err?.message || 'Failed to process image.'); return; }
    }
    if (finalFile.size > MAX_UPLOAD_BYTES) { toast.error('Image is too large. Please choose a smaller image.'); return; }
    setImageFile(finalFile);
    setProfile(prev => ({ ...prev, profileImage: URL.createObjectURL(finalFile) }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', profile.fullName);
      formData.append('phone', profile.phone);
      formData.append('address', profile.address);
      formData.append('dob', profile.dob);
      formData.append('gender', profile.gender);
      if (imageFile) formData.append('image', imageFile);
      const { data } = await axios.post(`${backendurl}/api/user/update-profile`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setUserData(data.data); setEditMode(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false); setImageFile(null);
    if (userData) setProfile({
      fullName:     userData.fullName || '',
      email:        userData.email || '',
      phone:        userData.phone || '',
      address:      userData.address || '',
      gender:       userData.gender || 'Male',
      dob:          userData.dob ? userData.dob.split('T')[0] : '',
      profileImage: userData.image || 'https://i.pravatar.cc/160',
    });
  };

  if (!userData) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 size={32} className="animate-spin text-brand-500" />
    </div>
  );

  const Field = ({ label, name, type = 'text', children }) => (
    <div>
      <label className="label">{label}</label>
      {editMode
        ? children
        : <div className="text-sm font-medium text-ink py-2">{profile[name] || '—'}</div>
      }
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 w-full py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-ink mb-6">My Profile</h1>

        <div className="card p-8 flex flex-col md:flex-row gap-10">
          {/* ─── Avatar ─── */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-4">
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-brand-200 shadow-card"
              />
              {editMode && (
                <label className="absolute bottom-1 right-1 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-brand-700 transition-colors">
                  <Camera size={14} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-base font-semibold text-ink text-center">{profile.fullName}</p>
            <p className="text-sm text-ink-muted text-center">{profile.email}</p>
          </div>

          {/* ─── Form ─── */}
          <form className="flex-1 flex flex-col gap-5" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full Name" name="fullName">
                <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="input" />
              </Field>
              <div>
                <label className="label">Email</label>
                <div className="text-sm font-medium text-ink py-2">{profile.email}</div>
              </div>
              <Field label="Phone" name="phone">
                <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="input" />
              </Field>
              <Field label="Address" name="address">
                <input type="text" name="address" value={profile.address} onChange={handleChange} className="input" />
              </Field>
              <Field label="Gender" name="gender">
                <select name="gender" value={profile.gender} onChange={handleChange} className="input">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Date of Birth" name="dob">
                <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="input" />
              </Field>
            </div>

            <div className="divider" />

            <div className="flex gap-3">
              {editMode ? (
                <>
                  <button type="button" onClick={handleSave} disabled={loading} className="btn-primary">
                    {loading ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Changes'}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
                </>
              ) : (
                <button type="button" onClick={() => setEditMode(true)} className="btn-secondary">
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;