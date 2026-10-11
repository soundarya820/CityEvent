import React, { useState } from 'react';
import { registrationService } from '../../services/registrationService';
import { X, AlertCircle, CheckCircle2, Upload, FileCheck, RefreshCw } from 'lucide-react';

export const ResubmitPaymentModal = ({ registration, userId, onClose, onSuccess }) => {
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setApiError('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setApiError('Invalid file format. Only JPG, JPEG, and PNG images are allowed.');
      setScreenshotFile(null);
      setScreenshotPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApiError('File size exceeds 5 MB limit. Please select a smaller file.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    if (!screenshotFile) {
      setApiError('Please select a new payment screenshot to upload.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registrationService.resubmitPaidPayment({
        registrationId: registration.id,
        userId,
        screenshotFile,
        screenshotPreviewUrl: screenshotPreview
      });

      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setApiError(err.message || 'Payment proof resubmission failed.');
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
      <div className="card" style={{ maxWidth: '520px', width: '100%', position: 'relative' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-rejected-text)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            <RefreshCw size={16} /> RESUBMIT PAYMENT PROOF
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{registration.eventName}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Entry Fee: <strong>₹{registration.entryFee}</strong>
          </p>
        </div>

        {/* Rejection Reason Notice */}
        <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Organizer Rejection Reason:</strong>
            <span style={{ fontSize: '0.85rem' }}>{registration.rejectionReason || 'Invalid or unclear payment screenshot.'}</span>
          </div>
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
            <label className="form-label" htmlFor="newScreenshot">
              Upload New Payment Screenshot *
            </label>
            <div style={{ border: '2px dashed var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--bg-input)' }}>
              <input
                id="newScreenshot"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                disabled={isSubmitting}
                style={{ display: 'none' }}
              />
              <label htmlFor="newScreenshot" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={26} color="var(--primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Click to select new payment screenshot</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>JPG, JPEG, PNG (Max 5 MB)</span>
              </label>

              {screenshotFile && (
                <div style={{ marginTop: '0.75rem', padding: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--status-approved-text)' }}>
                  <FileCheck size={16} /> Selected: {screenshotFile.name}
                </div>
              )}
            </div>
          </div>

          {screenshotPreview && (
            <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>New Screenshot Preview:</span>
              <img src={screenshotPreview} alt="New Screenshot Preview" style={{ maxHeight: '120px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Resubmitting...' : 'Resubmit Payment Proof'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
