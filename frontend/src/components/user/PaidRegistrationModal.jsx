import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import { X, AlertCircle, CheckCircle2, QrCode, Upload, FileCheck, ArrowRight } from 'lucide-react';

export const PaidRegistrationModal = ({ event, userId, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    fromCity: ''
  });

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setApiError('');
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setApiError('Invalid file format. Only JPG, JPEG, and PNG images are allowed.');
      setScreenshotFile(null);
      setScreenshotPreview(null);
      return;
    }

    // Validate size (5 MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setApiError('File size exceeds 5 MB limit. Please choose a smaller file.');
      setScreenshotFile(null);
      setScreenshotPreview(null);
      return;
    }

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
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

    if (!screenshotFile) {
      errs.screenshot = 'Payment screenshot is required for paid registration.';
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
      const res = await registrationService.createPaidRegistration({
        userId,
        eventId: event.id,
        participantData: formData,
        screenshotFile,
        screenshotPreviewUrl: screenshotPreview
      });

      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        navigate('/user/registrations');
      }, 1500);
    } catch (err) {
      setApiError(err.message || 'Paid registration submission failed. Please try again.');
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
      <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            <QrCode size={18} /> PAID EVENT REGISTRATION
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{event.eventName}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Entry Fee: <strong style={{ color: '#fff', fontSize: '1.1rem' }}>₹{event.entryFee}</strong>
          </p>
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
          {/* Section 1: Participant Information */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
            1. Participant Information
          </h4>

          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-input"
              placeholder="e.g. Alex User"
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
                placeholder="user@example.com"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
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

          {/* Section 2: Payment Section (Embedded on same page) */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
            2. Payment Section (Entry Fee: ₹{event.entryFee})
          </h4>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <div style={{ textAlignment: 'center', flexShrink: 0 }}>
              <img
                src={event.paymentQrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=techevents@upi&pn=TechEventsCo'}
                alt="Organizer Payment QR Code"
                style={{ width: '130px', height: '130px', borderRadius: 'var(--radius-sm)', border: '2px solid #fff', backgroundColor: '#fff' }}
              />
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', textAlign: 'center' }}>
                Organizer QR Code
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>Payment Instructions:</strong>
              <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                <li>Scan the QR code using any UPI payment app (GPay, PhonePe, Paytm).</li>
                <li>Transfer the exact entry fee of <strong>₹{event.entryFee}</strong>.</li>
                <li>Take a clear screenshot of the payment confirmation receipt.</li>
                <li>Upload the screenshot below (JPG, JPEG, PNG • Max 5 MB).</li>
              </ol>
            </div>
          </div>

          {/* Screenshot File Upload */}
          <div className="form-group">
            <label className="form-label" htmlFor="screenshotUpload">
              Upload Payment Screenshot *
            </label>
            <div style={{ border: '2px dashed var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--bg-input)' }}>
              <input
                id="screenshotUpload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                disabled={isSubmitting}
                style={{ display: 'none' }}
              />
              <label htmlFor="screenshotUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={28} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click to select payment screenshot</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Supported formats: JPG, JPEG, PNG (Max 5 MB)</span>
              </label>

              {screenshotFile && (
                <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--status-approved-text)' }}>
                  <FileCheck size={16} /> Selected: {screenshotFile.name} ({(screenshotFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
            {errors.screenshot && <span className="form-error-msg"><AlertCircle size={14} /> {errors.screenshot}</span>}
          </div>

          {/* Screenshot Preview */}
          {screenshotPreview && (
            <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Selected Screenshot Preview:</span>
              <img src={screenshotPreview} alt="Payment Screenshot Preview" style={{ maxHeight: '140px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Payment Proof...' : 'Submit Paid Registration'} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
