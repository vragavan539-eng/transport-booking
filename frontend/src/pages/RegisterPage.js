import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: 460 }}>
        <div className="auth-header">
          <span className="auth-logo">✈ TripBook</span>
          <h1>Create account</h1>
          <p>Join millions of happy travelers</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Rahul Sharma" autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label">Email address *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="rahul@example.com" />
          </div>

          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+91 9876543210" />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="pass-wrap">
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="form-input" placeholder="Min. 6 characters" />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(v => !v)}>{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password *</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} className="form-input" placeholder="Re-enter password" />
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
