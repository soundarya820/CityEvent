import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { Calendar, Plus, Clock, CheckCircle2, XCircle, AlertTriangle, Eye, ArrowRight, Users } from 'lucide-react';

export const OrganizerDashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        if (user) {
          const data = await eventService.getOrganizerEvents(user.id);
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to load organizer dashboard events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const totalEvents = events.length;
  const pendingEvents = events.filter((e) => e.status === 'Pending').length;
  const approvedEvents = events.filter((e) => e.status === 'Approved').length;
  const rejectedEvents = events.filter((e) => e.status === 'Rejected').length;
  const cancelledEvents = events.filter((e) => e.status === 'Cancelled').length;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Organizer Portal 🏢</h1>
          <p>Welcome back, <strong>{user?.organizationName || user?.fullName}</strong>! (Contact: {user?.contactPersonName || 'Organizer'})</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/organizer/events" className="btn btn-secondary">
            Manage My Events
          </Link>
          <Link to="/organizer/events/create" className="btn btn-primary">
            <Plus size={18} /> Create Event
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total My Events</span>
            <Calendar size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalEvents}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Pending Review</span>
            <Clock size={18} color="var(--status-pending-text)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>{pendingEvents}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Approved Events</span>
            <CheckCircle2 size={18} color="var(--status-approved-text)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-approved-text)' }}>{approvedEvents}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Rejected Events</span>
            <XCircle size={18} color="var(--status-rejected-text)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-rejected-text)' }}>{rejectedEvents}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Cancelled Events</span>
            <AlertTriangle size={18} color="var(--status-cancelled-text)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-cancelled-text)' }}>{cancelledEvents}</div>
        </div>
      </div>

      {/* My Events Preview Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Events Overview</h3>
          <Link to="/organizer/events" style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View All Events <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
            <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
          </div>
        ) : events.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
            No events created yet. Click "Create Event" to get started!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {events.slice(0, 4).map((event) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-input)',
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{event.eventName}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {event.category} • {event.city} • {new Date(event.eventDate).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`status-badge ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <Link to={`/organizer/events/${event.id}`} className="btn btn-secondary btn-sm" title="View">
                      <Eye size={14} /> View
                    </Link>
                    <Link to={`/organizer/events/${event.id}/participants`} className="btn btn-primary btn-sm" title="Participants">
                      <Users size={14} /> Participants
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
