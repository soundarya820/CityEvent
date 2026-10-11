import React, { useState } from 'react';
import { registrationService } from '../../services/registrationService';
import { X, Calendar, MapPin, User, Mail, Phone, Clock, AlertTriangle, FileText, XCircle, RefreshCw } from 'lucide-react';
import { ResubmitPaymentModal } from './ResubmitPaymentModal';

export const RegistrationDetailsModal = ({ registration, userId, onClose, onRefresh }) => {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isFree = registration.entryType === 'Free';
  const isConfirmed = registration.status === 'Confirmed';
  const isRejected = registration.status === 'Rejected';
  const isPending = registration.status === 'Pending Verification';

  const handleCancelRegistration = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsCancelling(true);

    try {
      const res = await registrationService.cancelFreeRegistration(registration.id, userId);
      setSuccessMsg(res.message);
      setTimeout(() => {
        setShowConfirmCancel(false);
        if (onRefresh) onRefresh();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel registration.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
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
        <div className="card" style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', paddingRight: '2rem' }}>
              <span className={`status-badge ${registration.status.toLowerCase().replace(' ', '-')}`}>
                {registration.status}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Reg ID: {registration.id}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{registration.eventName}</h2>
          </div>

          {errorMsg && (
            <div className="alert alert-danger">
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success">
              <span>{successMsg}</span>
            </div>
          )}

          {/* Rejection Reason Notice */}
          {isRejected && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Registration Rejected by Organizer:</strong>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{registration.rejectionReason || 'Invalid payment receipt.'}</p>
              </div>
            </div>
          )}

          {/* Pending Verification Notice */}
          {isPending && (
            <div className="alert alert-info" style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <Clock size={18} style={{ flexShrink: 0 }} />
              <span>Payment verification is pending. The event organizer will review your payment screenshot shortly.</span>
            </div>
          )}

          {/* Participant Details */}
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> Participant Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div><strong>Name:</strong> {registration.participantName}</div>
              <div><strong>Email:</strong> {registration.email}</div>
              <div><strong>Phone:</strong> {registration.phone}</div>
              <div><strong>Age / Gender:</strong> {registration.age} yrs • {registration.gender}</div>
              <div><strong>City:</strong> {registration.fromCity}</div>
              <div><strong>Submission Time:</strong> {new Date(registration.submissionTime).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Payment Info for Paid Event */}
          {registration.entryType === 'Paid' && (
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} /> Payment Information (Fee: ₹{registration.entryFee})
              </h4>
              {registration.paymentScreenshotUrl ? (
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem' }}>Uploaded Payment Screenshot:</span>
                  <img
                    src={registration.paymentScreenshotUrl}
                    alt="Payment Screenshot"
                    style={{ maxHeight: '180px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No screenshot available.</p>
              )}
            </div>
          )}

          {/* Actions Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div>
              {/* Cancel Button only available for Confirmed Free Registrations */}
              {isFree && isConfirmed && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowConfirmCancel(true)}
                >
                  <XCircle size={16} /> Cancel Registration
                </button>
              )}

              {/* Resubmit Payment Button available for Rejected Paid Registrations */}
              {isRejected && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowResubmitModal(true)}
                >
                  <RefreshCw size={16} /> Resubmit Payment Proof
                </button>
              )}
            </div>

            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>

          {/* Confirmation Modal for Free Registration Cancellation */}
          {showConfirmCancel && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700, marginBottom: '0.5rem' }}>
                Are you sure you want to cancel this registration?
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Your seat will be released for other participants. You can register again in the future if seats are available.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowConfirmCancel(false)} disabled={isCancelling}>
                  No, Keep Registration
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={handleCancelRegistration} disabled={isCancelling}>
                  {isCancelling ? 'Cancelling...' : 'Yes, Confirm Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resubmit Payment Modal Overlay */}
      {showResubmitModal && (
        <ResubmitPaymentModal
          registration={registration}
          userId={userId}
          onClose={() => setShowResubmitModal(false)}
          onSuccess={() => {
            setShowResubmitModal(false);
            if (onRefresh) onRefresh();
            onClose();
          }}
        />
      )}
    </>
  );
};
