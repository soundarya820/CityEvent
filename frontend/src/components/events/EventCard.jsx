import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building2, Ticket, Users, AlertTriangle } from 'lucide-react';

export const EventCard = ({ event }) => {
  const isCancelled = event.status === 'Cancelled';
  const isFull = !isCancelled && event.availableSeats === 0;

  return (
    <div
      className="card"
      style={{
        padding: '0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        border: isCancelled ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)'
      }}
    >
      {/* Event Poster Image Header */}
      <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#0f172a' }}>
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

        {/* Category Tag */}
        <span
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-main)',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            border: '1px solid var(--border-color)'
          }}
        >
          {event.category}
        </span>

        {/* Price / Entry Badge */}
        <span
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: event.entryType === 'Free' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(99, 102, 241, 0.9)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: '800',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          {event.entryType === 'Free' ? 'FREE' : `₹${event.entryFee}`}
        </span>

        {/* Event Cancelled Overlay Banner */}
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
              padding: '0.4rem',
              fontWeight: '800',
              fontSize: '0.85rem',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <AlertTriangle size={16} /> EVENT CANCELLED
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            lineHeight: '1.3',
            color: isCancelled ? 'var(--text-muted)' : 'var(--text-main)'
          }}
        >
          {event.eventName}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={14} color="var(--primary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.organizerName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} color="var(--secondary)" />
            <span>{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} color="var(--accent)" />
            <span>{event.area}, {event.city}</span>
          </div>
        </div>

        {/* Footer info & action */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: isFull ? '#ef4444' : 'var(--text-muted)' }}>
            <Users size={15} />
            {isFull ? (
              <span className="status-badge rejected">Registration Full</span>
            ) : isCancelled ? (
              <span>Seats: N/A</span>
            ) : (
              <span>{event.availableSeats} seats left</span>
            )}
          </div>

          <Link to={`/user/events/${event.id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
