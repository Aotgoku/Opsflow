import React, { useState, useEffect } from 'react';
import api from '../api';
import { useApp } from '../context/AppContext';

function Section({ title, icon, children }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{icon}</span>
        <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="font-label-md text-label-md text-on-surface-variant">{label}</label>
      {children}
    </div>
  );
}

const INPUT_CLS = 'h-10 px-3 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full';

export default function Settings() {
  const { showToast } = useApp();

  // Profile state
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [savingPw, setSavingPw]     = useState(false);
  const [pwError, setPwError]       = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/users/me');
        setName(res.data.name);
        setEmail(res.data.email);
      } catch {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingProfile(true);
    try {
      await api.put('/api/users/me', { name: name.trim(), email: email.trim() });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (!currentPw || !newPw || !confirmPw) {
      setPwError('All fields are required.');
      return;
    }
    if (newPw.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }
    setSavingPw(true);
    try {
      await api.put('/api/users/me', { currentPassword: currentPw, newPassword: newPw });
      showToast('Password changed successfully!', 'success');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-surface">
      {/* Header */}
      <div className="px-margin-page py-xl border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-1">Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage your account and preferences.</p>
      </div>

      <div className="p-margin-page max-w-2xl">

        {/* Profile */}
        <Section title="Profile Information" icon="person">
          <form onSubmit={handleSaveProfile}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary text-2xl font-bold">
                {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="font-headline-md text-headline-md text-on-surface">{name}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{email}</p>
              </div>
            </div>
            <Field label="FULL NAME">
              <input id="settings-name" type="text" value={name} onChange={e => setName(e.target.value)} className={INPUT_CLS} placeholder="Your name" required />
            </Field>
            <Field label="EMAIL ADDRESS">
              <input id="settings-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={INPUT_CLS} placeholder="your@email.com" required />
            </Field>
            <button
              type="submit"
              disabled={savingProfile}
              className="h-10 bg-primary text-on-primary rounded-lg font-label-md text-label-md px-6 hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {savingProfile ? (
                <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Saving…</>
              ) : (
                <><span className="material-symbols-outlined text-[16px]">save</span>Save Profile</>
              )}
            </button>
          </form>
        </Section>

        {/* Password */}
        <Section title="Change Password" icon="lock">
          <form onSubmit={handleChangePassword}>
            <Field label="CURRENT PASSWORD">
              <input id="current-pw" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className={INPUT_CLS} placeholder="••••••••" />
            </Field>
            <Field label="NEW PASSWORD">
              <input id="new-pw" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={INPUT_CLS} placeholder="Min. 6 characters" />
            </Field>
            <Field label="CONFIRM NEW PASSWORD">
              <input id="confirm-pw" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={INPUT_CLS} placeholder="Repeat new password" />
            </Field>
            {pwError && (
              <p className="text-error text-sm font-medium mb-4">{pwError}</p>
            )}
            <button
              type="submit"
              disabled={savingPw}
              className="h-10 bg-primary text-on-primary rounded-lg font-label-md text-label-md px-6 hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {savingPw ? (
                <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Updating…</>
              ) : (
                <><span className="material-symbols-outlined text-[16px]">lock_reset</span>Update Password</>
              )}
            </button>
          </form>
        </Section>

        {/* Preferences (UI only) */}
        <Section title="Preferences" icon="tune">
          <div className="flex flex-col gap-4">
            {[
              { label: 'Email notifications', desc: 'Receive task updates via email', id: 'pref-email' },
              { label: 'Desktop notifications', desc: 'Show browser push notifications', id: 'pref-desktop' },
              { label: 'Weekly digest', desc: 'Get a weekly summary of your progress', id: 'pref-digest' },
            ].map(pref => (
              <div key={pref.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-body-md text-body-md font-medium text-on-surface">{pref.label}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input id={pref.id} type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-container peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone" icon="warning">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="font-body-md text-body-md font-medium text-red-800">Delete Account</p>
              <p className="font-body-sm text-body-sm text-red-600">Permanently delete your account and all data.</p>
            </div>
            <button
              onClick={() => alert('Please contact your administrator to delete your account.')}
              className="px-4 py-2 border border-red-400 text-red-700 rounded-lg font-label-md text-label-md hover:bg-red-100 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
