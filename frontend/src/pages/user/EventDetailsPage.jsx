import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { FreeRegistrationModal } from '../../components/user/FreeRegistrationModal';
import { PaidRegistrationModal } from '../../components/user/PaidRegistrationModal';
import { ArrowLeft, Calendar, Clock, MapPin, Building2, Ticket, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const EventDetailsPage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ev = await eventService.getEventById(eventId);
        setEvent(ev);

        if (user) {
          const regs = await registrationService.getUserRegistrations(user.id);
          setUserRegistrations(regs);
        }
      } catch (err) {
        setError(err.message || 'Event not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, user]);

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
            {error || 'The requested event does not exist or has been removed.'}
          </p>
          <Link to="/user/dashboard" className="btn btn-primary">
            Back to Event Discovery
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = event.status === 'Cancelled';
  const isFull = !isCancelled && event.availableSeats === 0;

  // Check if active registration exists (status !== 'Cancelled')
  const existingActiveRegistration = userRegistrations.find(
    (r) => r.eventId === event.id && r.status !== 'Cancelled'
  );

  const handleRegisterClick = () => {
    if (event.entryType === 'Free') {
      setShowFreeModal(true);
    } else {
      setShowPaidModal(true);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link to="/user/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Back to Event Discovery
      </Link>

      {/* Main Details Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
        {/* Banner Poster */}
        <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#0f172a' }}>
          <img
            src={event.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
            alt={event.eventName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: isCancelled ? 'grayscale(80%) opacity(0.7)' : 'none'
            }}
          />

          <span
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: '700',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)'
            }}
          >
            {event.category}
          </span>

          <span
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: event.entryType === 'Free' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(99, 102, 241, 0.95)',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '800',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {event.entryType === 'Free' ? 'FREE ENTRY' : `₹${event.entryFee}`}
          </span>

          {isCancelled && (
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'rgba(239, 68, 68, 0.95)',
                color: '#fff',
                textAlign: 'center',
                padding: '0.6rem',
                fontWeight: '800',
                fontSize: '1rem',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertTriangle size={20} /> EVENT CANCELLED BY ORGANIZER
            </div>
          )}
        </div>

        {/* Event Content Details */}
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.3' }}>
            {event.eventName}
          </h1>

          {/* Quick Specifications Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building2 size={22} color="var(--primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Organizer</span>
                <strong style={{ fontSize: '0.9rem' }}>{event.organizerName}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={22} color="var(--secondary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Date</span>
                <strong style={{ fontSize: '0.9rem' }}>{new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={22} color="var(--status-pending-text)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Time</span>
                <strong style={{ fontSize: '0.9rem' }}>{event.startTime} - {event.endTime}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={22} color="var(--accent)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Location</span>
                <strong style={{ fontSize: '0.9rem' }}>{event.venue}, {event.area}, {event.city}</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>About the Event</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Seat Capacity Bar */}
          <div style={{ padding: '1.25rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Event Capacity: </span>
              <strong style={{ color: 'var(--text-main)' }}>{event.maxParticipants} Maximum Seats</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Available Seats: </span>
              <strong style={{ color: isFull ? '#ef4444' : 'var(--status-approved-text)', fontSize: '1.1rem' }}>
                {isCancelled ? '0' : event.availableSeats}
              </strong>
            </div>
          </div>

          {/* Registration CTA Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            {isCancelled ? (
              <button className="btn btn-danger" disabled style={{ opacity: 0.8 }}>
                <AlertTriangle size={18} /> Event Cancelled
              </button>
            ) : isFull ? (
              <button className="btn btn-danger" disabled style={{ opacity: 0.8 }}>
                <Users size={18} /> Registration Full
              </button>
            ) : existingActiveRegistration ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-approved-text)', fontWeight: 700, fontSize: '0.9rem' }}>
                  <CheckCircle2 size={20} /> You are already registered for this event ({existingActiveRegistration.status})
                </div>
                <Link to="/user/registrations" className="btn btn-secondary btn-sm">
                  View My Registrations
                </Link>
              </div>
            ) : (
              <button onClick={handleRegisterClick} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                <Ticket size={20} /> Register Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Free Registration Modal */}
      {showFreeModal && (
        <FreeRegistrationModal
          event={event}
          userId={user?.id}
          onClose={() => setShowFreeModal(false)}
        />
      )}

      {/* Paid Registration Modal */}
      {showPaidModal && (
        <PaidRegistrationModal
          event={event}
          userId={user?.id}
          onClose={() => setShowPaidModal(false)}
        />
      )}
    </div>
  );
};
