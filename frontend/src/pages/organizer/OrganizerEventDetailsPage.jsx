import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { ArrowLeft, Calendar, Clock, MapPin, Building2, Ticket, Users, AlertTriangle, Edit, Trash2, XCircle, ShieldAlert } from 'lucide-react';

export const OrganizerEventDetailsPage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await eventService.getOrganizerEventById(eventId, user?.id);
        setEvent(data);
      } catch (err) {
        setError(err.message || 'Access Denied or Event not found.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchEvent();
  }, [eventId, user]);

  const handleDelete = async () => {
    try {
      await eventService.deletePendingOrRejectedEvent(event.id, user.id);
      navigate('/organizer/events');
    } catch (err) {
      setError(err.message || 'Failed to delete event.');
    }
  };

  const handleCancelApproved = async () => {
    try {
      await eventService.cancelApprovedEvent(event.id, user.id);
      setShowCancelModal(false);
      const updated = await eventService.getOrganizerEventById(eventId, user.id);
      setEvent(updated);
    } catch (err) {
      setError(err.message || 'Failed to cancel event.');
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
            {error || 'You do not have permission to access this event.'}
          </p>
          <Link to="/organizer/events" className="btn btn-primary">
            Return to My Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/organizer/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Back to My Events
      </Link>

      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: '1.3' }}>{event.eventName}</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {event.status !== 'Cancelled' && (
                <Link to={`/organizer/events/${event.id}/edit`} className="btn btn-secondary btn-sm">
                  <Edit size={16} /> Edit Event
                </Link>
              )}
              <Link to={`/organizer/events/${event.id}/participants`} className="btn btn-primary btn-sm">
                <Users size={16} /> Registrations & Participants
              </Link>
            </div>
          </div>

          {event.status === 'Rejected' && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <AlertTriangle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Admin Rejection Reason:</strong>
                <span>{event.rejectionReason || 'Specifications incomplete.'}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Category</span>
              <strong>{event.category}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Date & Time</span>
              <strong>{new Date(event.eventDate).toLocaleDateString()} ({event.startTime} - {event.endTime})</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Location</span>
              <strong>{event.venue}, {event.area}, {event.city}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Confirmed Capacity</span>
              <strong>{event.confirmedRegistrationsCount} / {event.maxParticipants} Seats</strong>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Event Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{event.description}</p>
          </div>

          {event.entryType === 'Paid' && event.paymentQrUrl && (
            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Payment QR Code (Entry Fee: ₹{event.entryFee})</h4>
              <img src={event.paymentQrUrl} alt="Payment QR" style={{ width: '130px', height: '130px', borderRadius: 'var(--radius-sm)', border: '2px solid #fff', backgroundColor: '#fff' }} />
            </div>
          )}

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            {(event.status === 'Pending' || event.status === 'Rejected') && (
              <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={16} /> Delete Event
              </button>
            )}

            {event.status === 'Approved' && (
              <button className="btn btn-danger btn-sm" onClick={() => setShowCancelModal(true)}>
                <XCircle size={16} /> Cancel Approved Event
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
            <Trash2 size={42} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Delete Event?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Approved Event Confirmation Modal */}
      {showCancelModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>
            <XCircle size={42} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Cancel Approved Event?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Are you sure you want to cancel this approved event? Status will change to Cancelled and no new registrations will be permitted.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Keep Approved</button>
              <button className="btn btn-danger" onClick={handleCancelApproved}>Yes, Cancel Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
