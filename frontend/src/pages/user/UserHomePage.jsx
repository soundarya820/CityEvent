import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { EventSearch } from '../../components/events/EventSearch';
import { EventCard } from '../../components/events/EventCard';
import { Compass, Calendar, AlertCircle } from 'lucide-react';

export const UserHomePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch discoverable events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.searchEvents(searchTerm);
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchTerm]);

  return (
    <div>
      {/* Header Banner */}
      <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>Discover Local Events, {user?.fullName?.split(' ')[0]}! 👋</h1>
          <p>Explore upcoming concerts, tech summits, sports, and cultural meetups in your city.</p>
        </div>
        <span className="role-tag user" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          USER DISCOVERY
        </span>
      </div>

      {/* Event Search Component */}
      <EventSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Main Events Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '540px', margin: '2rem auto' }}>
          <Calendar size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No events found.</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            We couldn't find any events matching your search criteria. Try searching for a different keyword, city, or entry type.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => setSearchTerm('')}>
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {events.length} event{events.length === 1 ? '' : 's'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
