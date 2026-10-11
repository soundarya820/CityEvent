import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { Calendar, Eye, Filter, Building2 } from 'lucide-react';

export const AdminEventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.getAllEvents(statusFilter);
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [statusFilter]);

  const handleFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    if (newStatus === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ status: newStatus });
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Platform Events Governance 📅</h1>
          <p>Review all events created across all organizers.</p>
        </div>

        {/* Status Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status Filter:</span>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '540px', margin: '2rem auto' }}>
          <Calendar size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>No Events Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No events match the selected status filter "{statusFilter}".
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Event Name</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Organizer</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Event Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Entry Type</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                      {event.eventName}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Building2 size={14} color="var(--primary)" /> {event.organizerName}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                      {event.category}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontWeight: 700, color: event.entryType === 'Free' ? 'var(--status-approved-text)' : 'var(--primary)' }}>
                        {event.entryType === 'Free' ? 'FREE' : `Paid (₹${event.entryFee})`}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`status-badge ${event.status.toLowerCase()}`}>
                        {event.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <Link to={`/admin/events/${event.id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} /> Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
