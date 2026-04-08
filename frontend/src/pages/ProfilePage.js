import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [tab, setTab] = useState('profile');

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await api.put('/users/profile', profile);
      // Update stored user
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, ...profile }));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) { toast.error('Fill all fields'); return; }
    if (passwords.newPassword.length < 6) { toast.error('New password too short'); return; }
    if (passwords.newPassword !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    setChangingPass(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
              {user?.role === 'admin' && <span className="badge badge-flight">Admin</span>}
            </div>
            <nav className="profile-nav">
              <button className={`profile-nav-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
                👤 Edit Profile
              </button>
              <button className={`profile-nav-btn ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
                🔒 Change Password
              </button>
            </nav>
          </div>

          {/* Main content */}
          <div className="profile-main">
            {tab === 'profile' && (
              <div className="profile-section card">
                <h2 className="profile-section-title">Edit Profile</h2>
                <form onSubmit={handleProfileSave}>
                  <div className="profile-form">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email (cannot be changed)</label>
                      <input type="email" className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+91 XXXXXXXXXX"
                        value={profile.phone}
                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Account Type</label>
                      <input type="text" className="form-input" value={user?.role === 'admin' ? 'Administrator' : 'Traveler'} disabled style={{ opacity: 0.6 }} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'password' && (
              <div className="profile-section card">
                <h2 className="profile-section-title">Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="profile-form">
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Enter current password"
                        value={passwords.currentPassword}
                        onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="At least 6 characters"
                        value={passwords.newPassword}
                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Re-enter new password"
                        value={passwords.confirm}
                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={changingPass}>
                    {changingPass ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
