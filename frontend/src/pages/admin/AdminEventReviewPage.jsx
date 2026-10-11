import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { ArrowLeft, Calendar, Clock, MapPin, Building2, Ticket, Users, AlertTriangle, CheckCircle2, XCircle, Check, X, Shield } from 'lucide-react';

export const AdminEventReviewPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEventById(eventId);
      setEvent(data);
    } catch (err) {
      setError(err.message || 'Event not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleApprove = async () => {
    setError('');
    setActionMsg('');
    setIsSubmitting(true);
    try {
      const res = await eventService.approveEvent(eventId);
      setActionMsg(res.message);
      fetchEvent();
      setTimeout(() => setActionMsg(''), 2500);
    } catch (err) {
      setError(err.message || 'Failed to approve event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    setRejectionError('');

    if (!rejectionReasonInput.trim()) {
      setRejectionError('A rejection reason is mandatory when rejecting an event.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await eventService.rejectEvent(eventId, rejectionReasonInput);
      setActionMsg(res.message);
      setShowRejectModal(false);
      setRejectionReasonInput('');
      fetchEvent();
      setTimeout(() => setActionMsg(''), 2500);
    } catch (err) {
      setRejectionError(err.message || 'Failed to reject event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="main-content" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Event Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || 'The requested event does not exist.'}
          </p>
          <Link to="/admin/events" className="btn btn-primary">
            Return to Events List
          </Link>
        </div>
      </div>
    );
  }

  const isPending = event.status === 'Pending';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/admin/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Back to All Events
      </Link>

      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
        {/* Banner Poster Header */}
        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#0f172a' }}>
          <img
            src={event.posterUrl}
            alt={event.eventName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <span className={`status-badge ${event.status.toLowerCase()}`} style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.85rem' }}>
            {event.status}
          </span>

          <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: '0.9rem', fontWeight: 800, padding: '0.35rem 0.85rem', borderRadius: '9999px' }}>
            {event.entryType === 'Free' ? 'FREE ENTRY' : `₹${event.entryFee}`}
          </span>
        </div>

        <div style={{ padding: '2rem' }}>
          {actionMsg && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
              <CheckCircle2 size={18} />
              <span>{actionMsg}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: '1.3', marginBottom: '0.4rem' }}>{event.eventName}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Created by <strong style={{ color: 'var(--text-main)' }}>{event.organizerName}</strong> (Contact: {event.contactPerson})
            </p>
          </div>

          {event.status === 'Rejected' && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Rejection Reason Provided:</strong>
                <span>{event.rejectionReason}</span>
              </div>
            </div>
          )}

          {/* Event Specifications */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Category</span>
              <strong>{event.category}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Date & Schedule</span>
              <strong>{new Date(event.eventDate).toLocaleDateString()} ({event.startTime} - {event.endTime})</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Location & Venue</span>
              <strong>{event.venue}, {event.area}, {event.city}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Confirmed Registrations</span>
              <strong>{event.confirmedRegistrationsCount} / {event.maxParticipants} Seats</strong>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{event.description}</p>
          </div>

          {/* Payment QR (If Paid) */}
          {event.entryType === 'Paid' && event.paymentQrUrl && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>Payment QR Code (Entry Fee: ₹{event.entryFee})</h4>
              <img src={event.paymentQrUrl} alt="Payment QR Code" style={{ width: '130px', height: '130px', borderRadius: 'var(--radius-sm)', border: '2px solid #fff', backgroundColor: '#fff' }} />
            </div>
          )}

          {/* Admin Approval Actions Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <div>
              {!isPending && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Event is currently <strong style={{ color: 'var(--text-main)' }}>{event.status}</strong>. View only.
                </span>
              )}
            </div>

            {isPending && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-danger" onClick={() => setShowRejectModal(true)} disabled={isSubmitting}>
                  <X size={18} /> Reject Event
                </button>
                <button type="button" className="btn btn-primary" onClick={handleApprove} disabled={isSubmitting} style={{ background: '#10b981' }}>
                  <Check size={18} /> Approve Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Rejection Reason Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowRejectModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', color: '#ef4444' }}>Reject Event Submission</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Provide a mandatory rejection reason for <strong>"{event.eventName}"</strong>. The organizer will view this reason in their My Events portal.
            </p>

            {rejectionError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <AlertTriangle size={16} />
                <span>{rejectionError}</span>
              </div>
            )}

            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="rejectReason">Mandatory Rejection Reason *</label>
                <textarea
                  id="rejectReason"
                  className="form-textarea"
                  rows="3"
                  placeholder="e.g. Venue information is incomplete / Policy violation..."
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRejectModal(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
