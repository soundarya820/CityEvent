import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import { X, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';

export const FreeRegistrationModal = ({ event, userId, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    fromCity: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    
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

    if (!formData.age || parseInt(formData.age, 10) <= 0) {
      errs.age = 'Please enter a valid age.';
    }

    if (!formData.gender) errs.gender = 'Gender is required.';
    if (!formData.fromCity.trim()) errs.fromCity = 'Your City is required.';

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
      const res = await registrationService.createFreeRegistration({
        userId,
        eventId: event.id,
        participantData: formData
      });

      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        navigate('/user/registrations');
      }, 1500);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div className="card" style={{ maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-approved-text)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            <Ticket size={18} /> FREE EVENT REGISTRATION
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{event.eventName}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter participant information to confirm your seat.</p>
        </div>

        {apiError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{apiError}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.fullName && <span className="form-error-msg"><AlertCircle size={14} /> {errors.fullName}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.email && <span className="form-error-msg"><AlertCircle size={14} /> {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="form-input"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.phone && <span className="form-error-msg"><AlertCircle size={14} /> {errors.phone}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                className="form-input"
                placeholder="22"
                value={formData.age}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.age && <span className="form-error-msg"><AlertCircle size={14} /> {errors.age}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fromCity">From City</label>
              <input
                id="fromCity"
                name="fromCity"
                type="text"
                className="form-input"
                placeholder="Mumbai"
                value={formData.fromCity}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.fromCity && <span className="form-error-msg"><AlertCircle size={14} /> {errors.fromCity}</span>}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Confirm Free Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
