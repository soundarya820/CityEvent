import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, UserCheck, Mail, Phone, Lock, AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const OrganizerRegisterPage = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPersonName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerOrganizer } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.organizationName.trim()) errs.organizationName = 'Organization Name is required.';
    if (!formData.contactPersonName.trim()) errs.contactPersonName = 'Contact Person Name is required.';
    
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errs.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await registerOrganizer(formData);
      setSuccessMsg(res.message || 'Organizer account created! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <div className="auth-header">
          <h1>Organizer Registration</h1>
          <p>Create an Event Organizer account to publish & manage events</p>
        </div>

        <div className="alert alert-info" style={{ fontSize: '0.85rem' }}>
          <ShieldCheck size={18} style={{ flexShrink: 0 }} />
          <span>Organizer registration does NOT require Admin approval. Once registered, you can log in immediately.</span>
        </div>

        {apiError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{apiError}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="organizationName">Organization / Company Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="organizationName"
                name="organizationName"
                type="text"
                className="form-input"
                placeholder="Tech Events Co"
                value={formData.organizationName}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Building2 size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
            {errors.organizationName && <span className="form-error-msg"><AlertCircle size={14} /> {errors.organizationName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contactPersonName">Contact Person Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="contactPersonName"
                name="contactPersonName"
                type="text"
                className="form-input"
                placeholder="Sarah Organizer"
                value={formData.contactPersonName}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.5rem' }}
              />
              <UserCheck size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
            {errors.contactPersonName && <span className="form-error-msg"><AlertCircle size={14} /> {errors.contactPersonName}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Official Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
              {errors.email && <span className="form-error-msg"><AlertCircle size={14} /> {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-input"
                  placeholder="9876543211"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Phone size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
              {errors.phone && <span className="form-error-msg"><AlertCircle size={14} /> {errors.phone}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
              {errors.password && <span className="form-error-msg"><AlertCircle size={14} /> {errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
              {errors.confirmPassword && <span className="form-error-msg"><AlertCircle size={14} /> {errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
            {isSubmitting ? (
              <>
                <div className="spinner" /> Creating Organizer Account...
              </>
            ) : (
              <>
                Register Organizer Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already registered as Organizer?{' '}
          <Link to="/login" style={{ fontWeight: 700 }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};
