import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { ArrowLeft, Users, CheckCircle2, Clock, XCircle, FileText, AlertCircle, Eye, ShieldAlert, Check, X } from 'lucide-react';

export const EventParticipantsPage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const [viewScreenshotReg, setViewScreenshotReg] = useState(null);
  const [rejectRegTarget, setRejectRegTarget] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user) {
        const ev = await eventService.getOrganizerEventById(eventId, user.id);
        setEvent(ev);

        const regs = await registrationService.getEventRegistrations(eventId, user.id);
        setRegistrations(regs);
      }
    } catch (err) {
      setError(err.message || 'Access Denied or Event not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId, user]);

  const handleApprovePayment = async (regId) => {
    try {
      const res = await registrationService.approvePaidRegistration(regId, user.id);
      setActionMsg(res.message);
      fetchData();
      setTimeout(() => setActionMsg(''), 2500);
    } catch (err) {
      setError(err.message || 'Failed to approve payment.');
    }
  };

  const handleRejectPaymentSubmit = async (e) => {
    e.preventDefault();
    setRejectionError('');

    if (!rejectionReasonInput.trim()) {
      setRejectionError('Rejection reason is mandatory.');
      return;
    }

    try {
      const res = await registrationService.rejectPaidRegistration(rejectRegTarget.id, user.id, rejectionReasonInput);
      setActionMsg(res.message);
      setRejectRegTarget(null);
      setRejectionReasonInput('');
      fetchData();
      setTimeout(() => setActionMsg(''), 2500);
    } catch (err) {
      setRejectionError(err.message || 'Failed to reject payment.');
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
          <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || 'You do not have permission to view participant records for this event.'}
          </p>
          <Link to="/organizer/events" className="btn btn-primary">
            Return to My Events
          </Link>
        </div>
      </div>
    );
  }

  const confirmedCount = registrations.filter((r) => r.status === 'Confirmed').length;
  const pendingCount = registrations.filter((r) => r.status === 'Pending Verification').length;
  const rejectedCount = registrations.filter((r) => r.status === 'Rejected').length;
  const cancelledCount = registrations.filter((r) => r.status === 'Cancelled').length;
  const availableSeats = Math.max(0, event.maxParticipants - confirmedCount);

  return (
    <div>
      <Link to="/organizer/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Back to My Events
      </Link>

      <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>Event Participants 👥</h1>
          <p>{event.eventName} • {event.category} ({event.entryType})</p>
        </div>
        <span className="role-tag organizer" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          PARTICIPANT MANAGEMENT
        </span>
      </div>

      {actionMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle2 size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Summary Counters Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Capacity</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{event.maxParticipants}</div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-approved-text)' }}>Confirmed Registrations</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-approved-text)' }}>{confirmedCount}</div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-pending-text)' }}>Pending Verification</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>{pendingCount}</div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-rejected-text)' }}>Rejected Registrations</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-rejected-text)' }}>{rejectedCount}</div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Available Seats</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: availableSeats === 0 ? '#ef4444' : 'var(--text-main)' }}>{availableSeats}</div>
        </div>
      </div>

      {/* Participants Table */}
      {registrations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <Users size={44} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>No Registrations Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No participants have registered for this event yet.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Participant Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Age / Gender</th>
                  <th style={{ padding: '0.85rem 1rem' }}>City</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Payment Verification Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      {reg.participantName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      <div>{reg.email}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{reg.phone}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {reg.age} yrs • {reg.gender}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {reg.fromCity}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`status-badge ${reg.status.toLowerCase().replaceAll(' ', '-')}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        {reg.paymentScreenshotUrl && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setViewScreenshotReg(reg)}
                            title="View Payment Screenshot"
                          >
                            <Eye size={14} /> Screenshot
                          </button>
                        )}

                        {reg.status === 'Pending Verification' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => handleApprovePayment(reg.id)}
                              title="Approve Payment"
                              style={{ background: '#10b981' }}
                            >
                              <Check size={14} /> Approve
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => setRejectRegTarget(reg)}
                              title="Reject Payment"
                            >
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Payment Screenshot Modal */}
      {viewScreenshotReg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setViewScreenshotReg(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Payment Screenshot</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Participant: <strong>{viewScreenshotReg.participantName}</strong> (Fee: ₹{viewScreenshotReg.entryFee})
            </p>

            <img
              src={viewScreenshotReg.paymentScreenshotUrl}
              alt="Payment Screenshot"
              style={{ maxHeight: '320px', maxWidth: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setViewScreenshotReg(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal with Mandatory Reason */}
      {rejectRegTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button onClick={() => setRejectRegTarget(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: '#ef4444' }}>Reject Paid Registration</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Participant: <strong>{rejectRegTarget.participantName}</strong>
            </p>

            {rejectionError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <AlertCircle size={16} />
                <span>{rejectionError}</span>
              </div>
            )}

            <form onSubmit={handleRejectPaymentSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="rejectReason">Mandatory Rejection Reason *</label>
                <textarea
                  id="rejectReason"
                  className="form-textarea"
                  rows="3"
                  placeholder="e.g. Payment screenshot blurred / Transaction reference missing..."
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setRejectRegTarget(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Submit Payment Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
