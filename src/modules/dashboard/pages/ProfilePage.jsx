import React, { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Camera, Loader2, Mail, Pencil, Phone, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import useAuth from '../../auth/hooks/useAuth';
import { profileService } from '../services/profile.service';

const ROLE_LABELS = {
  admin: 'Admin',
  sub_admin: 'Sub Admin',
};

const formatRole = (role) => ROLE_LABELS[role] || role || 'Admin';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const statusClass = (status) => {
  if (status === 'blocked') {
    return 'bg-rose-50 text-rose-700 border-rose-200/60';
  }
  if (status === 'inactive') {
    return 'bg-slate-100 text-slate-600 border-slate-200';
  }
  return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
};

export function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const photoInputRef = useRef(null);

  const applyProfile = (data) => {
    setProfile(data);
    setForm({
      name: data?.name || '',
      email: data?.email || '',
      phone: data?.phone || '',
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setEditing(false);
    updateUser({
      id: data?.id,
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      photo: data?.photo,
      role: data?.role,
    });
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await profileService.getProfile();
      applyProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Load once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = () => {
    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setEditing(false);
  };

  const onPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error('Name, email, and phone are required.');
      return;
    }

    try {
      setSaving(true);
      const updated = await profileService.updateProfile(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        photoFile
      );
      applyProfile(updated);
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const photoSrc = photoPreview || profile?.photo;

  return (
    <DashboardLayout pageTitle="Staff Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
            <button type="button" className="ml-2 underline" onClick={fetchProfile}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading profile…</span>
          </div>
        ) : profile ? (
          <>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt={profile.name || 'Admin'}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 text-white text-3xl font-bold flex items-center justify-center border-2 border-slate-100 shadow-sm">
                    {(profile.name || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                {editing && (
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm"
                  >
                    <Camera className="h-3 w-3" />
                    Photo
                  </button>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                      <span>{profile.name}</span>
                      <BadgeCheck className="w-5 h-5 text-blue-600" />
                    </h2>
                    <p className="text-sm font-medium text-slate-600">
                      {formatRole(profile.role)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-center sm:self-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusClass(profile.status)}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {profile.status || 'active'}
                    </span>
                    {!editing && (
                      <button
                        type="button"
                        onClick={startEdit}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600 justify-center sm:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {profile.phone || '—'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    Joined {formatDate(profile.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                editing ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <form
                onSubmit={handleSubmit}
                aria-hidden={!editing}
                className={`min-h-0 overflow-hidden transition-transform duration-300 ease-out ${
                  editing
                    ? 'translate-y-0'
                    : 'pointer-events-none -translate-y-2'
                }`}
              >
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  Edit profile
                </h3>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onPhotoChange}
                  className="hidden"
                />

                <div className="mb-4 flex items-center gap-4">
                  {photoSrc ? (
                    <img
                      src={photoSrc}
                      alt="Selected profile photo"
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-lg font-bold text-slate-500">
                      {(form.name || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Photo</p>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Camera className="h-4 w-4" />
                      {photoFile ? 'Change photo' : 'Upload photo'}
                    </button>
                    {photoFile && (
                      <p className="mt-1 text-[11px] text-slate-500">{photoFile.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-xs font-semibold text-slate-600">
                    Name
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-slate-600">
                    Email
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-slate-600">
                    Phone
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save
                  </button>
                </div>
                </div>
              </form>
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
