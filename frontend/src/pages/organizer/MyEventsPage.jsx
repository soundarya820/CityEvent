import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { Calendar, Plus, Eye, Edit, Trash2, XCircle, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

export const MyEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [cancelEventTarget, setCancelEventTarget] = useState(null);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      if (user) {
        const data = await eventService.getOrganizerEvents(user.id);
        setEvents(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load organizer events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteEventTarget) return;
    try {
      const res = await eventService.deletePendingOrRejectedEvent(deleteEventTarget.id, user.id);
      setActionMsg(res.message);
      setDeleteEventTarget(null);
      fetchMyEvents();
      setTimeout(() => setActionMsg(''), 2500);
    } catch (err) {
      setError(err.message || 'Failed to delete event.');
    }
  };

  const handleCancelApproved = async () => {
    if (!cancelEventTarget) return;
    try {
      const res = await eventService.cancelApprovedEvent(cancelEventTarget.id, user.id);
      setActionMsg(res.message);
      setCancelEventTarget(null);
      fetchMyEvents();
      setTimeout(() => setActionMsg(''), 2500);
    } catch (err) {
      setError(err.message || 'Failed to cancel event.');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>My Events 📅</h1>
          <p>Manage events created by {user?.organizationName || user?.fullName}.</p>
        </div>
        <Link to="/organizer/events/create" className="btn btn-primary">
          <Plus size={18} /> Create New Event
        </Link>
      </div>

      {actionMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle2 size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '540px', margin: '2rem auto' }}>
          <Calendar size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Events Created Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            You haven't created any events yet. Click below to publish your first local event!
          </p>
          <Link to="/organizer/events/create" className="btn btn-primary">
            <Plus size={18} /> Create Event
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {events.map((event) => (
            <div key={event.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', height: '160px', backgroundColor: '#0f172a' }}>
                <img
                  src={event.posterUrl}
                  alt={event.eventName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <span className={`status-badge ${event.status.toLowerCase()}`} style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                  {event.status}
                </span>

                <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(15,23,42,0.85)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                  {event.entryType === 'Free' ? 'FREE' : `₹${event.entryFee}`}
                </span>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: '1.3' }}>
                  {event.eventName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {event.category} • {event.city}, {event.area}
                </p>

                {/* Status Rejection Alert snippet if Rejected */}
                {event.status === 'Rejected' && (
                  <div className="alert alert-danger" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Rejection Reason: {event.rejectionReason}
                    </span>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Seats: <strong>{event.confirmedRegistrationsCount} / {event.maxParticipants}</strong>
                  </span>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <Link to={`/organizer/events/${event.id}`} className="btn btn-secondary btn-sm" title="View Details">
                      <Eye size={14} />
                    </Link>

                    {event.status !== 'Cancelled' && (
                      <Link to={`/organizer/events/${event.id}/edit`} className="btn btn-secondary btn-sm" title="Edit Event">
                        <Edit size={14} />
                      </Link>
                    )}

                    <Link to={`/organizer/events/${event.id}/participants`} className="btn btn-primary btn-sm" title="Manage Participants">
                      <Users size={14} />
                    </Link>

                    {(event.status === 'Pending' || event.status === 'Rejected') && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteEventTarget(event)}
                        title="Delete Event"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {event.status === 'Approved' && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setCancelEventTarget(event)}
                        title="Cancel Approved Event"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteEventTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
            <Trash2 size={42} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Delete Event?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Are you sure you want to delete <strong>"{deleteEventTarget.eventName}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteEventTarget(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Approved Event Confirmation Modal */}
      {cancelEventTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>
            <XCircle size={42} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Cancel Approved Event?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Are you sure you want to cancel <strong>"{cancelEventTarget.eventName}"</strong>? Its status will change to <strong>Cancelled</strong> and new registrations will be blocked.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setCancelEventTarget(null)}>
                Keep Approved
              </button>
              <button className="btn btn-danger" onClick={handleCancelApproved}>
                Yes, Cancel Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
