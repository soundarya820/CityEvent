import React, { useState, useEffect } from 'react';
import { getMockRegistrations, getMockEvents, getMockUsers } from '../../data/mockData';
import { FileText, Calendar, Building2, Tag, Ticket, CheckCircle2, Filter } from 'lucide-react';

export const AdminRegistrationsPage = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entryTypeFilter, setEntryTypeFilter] = useState('All');

  useEffect(() => {
    const allEvents = getMockEvents();
    const allRegs = getMockRegistrations();
    const allUsers = getMockUsers();
    setEvents(allEvents);
    setRegistrations(allRegs);
    setLoading(false);
  }, []);

  // Build aggregate per-event registration summary
  const aggregateData = events.map((evt) => {
    const eventRegs = registrations.filter((r) => r.eventId === evt.id);
    const confirmedCount = eventRegs.filter((r) => r.status === 'Confirmed').length;
    const pendingCount = eventRegs.filter((r) => r.status === 'Pending Verification').length;
    const rejectedCount = eventRegs.filter((r) => r.status === 'Rejected').length;
    const cancelledCount = eventRegs.filter((r) => r.status === 'Cancelled').length;
    const totalRegs = eventRegs.length;

    return {
      eventId: evt.id,
      eventName: evt.eventName,
      organizerName: evt.organizerName,
      category: evt.category,
      entryType: evt.entryType,
      entryFee: evt.entryFee,
      maxParticipants: evt.maxParticipants,
      eventDate: evt.eventDate,
      eventStatus: evt.status,
      confirmedCount,
      pendingCount,
      rejectedCount,
      cancelledCount,
      totalRegs,
    };
  });

  // Filter by entry type
  const filtered = aggregateData.filter((row) => {
    if (entryTypeFilter === 'All') return true;
    return row.entryType === entryTypeFilter;
  });

  // Summary stats
  const totalConfirmed = registrations.filter((r) => r.status === 'Confirmed').length;
  const totalPending = registrations.filter((r) => r.status === 'Pending Verification').length;
  const totalRegistrations = registrations.length;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Registration Overview 📋</h1>
          <p>Platform-wide aggregate summary of confirmed registrations per event.</p>
        </div>
        <span className="role-tag admin" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          ADMIN MODULE
        </span>
      </div>

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Total Events</span>
            <Calendar size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{events.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>All Events</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Total Registrations</span>
            <FileText size={18} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalRegistrations}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>All Statuses</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--status-approved-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Confirmed</span>
            <CheckCircle2 size={18} color="var(--status-approved-text)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-approved-text)' }}>{totalConfirmed}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-approved-text)', fontWeight: 600 }}>Confirmed Seats</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--status-pending-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Pending Verification</span>
            <Ticket size={18} color="var(--status-pending-text)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>{totalPending}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-pending-text)', fontWeight: 600 }}>Awaiting Organizer</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <Filter size={15} color="var(--text-muted)" />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Entry Type:</span>
        <select
          className="form-select"
          value={entryTypeFilter}
          onChange={(e) => setEntryTypeFilter(e.target.value)}
          style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
        >
          <option value="All">All Types</option>
          <option value="Free">Free Events</option>
          <option value="Paid">Paid Events</option>
        </select>
        {entryTypeFilter !== 'All' && (
          <button className="btn btn-secondary btn-sm" onClick={() => setEntryTypeFilter('All')}>
            Clear Filter
          </button>
        )}
      </div>

      {/* Aggregate Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Events Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            No events match the current filter.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Event</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Organizer</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Entry Type</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Event Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Confirmed</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Pending</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.eventId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700 }}>{row.eventName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <Calendar size={11} /> {new Date(row.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                        <Building2 size={14} color="var(--primary)" />
                        {row.organizerName}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Tag size={13} />
                        {row.category}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        color: row.entryType === 'Free' ? 'var(--status-approved-text)' : 'var(--primary)'
                      }}>
                        {row.entryType === 'Free' ? 'FREE' : `Paid ₹${row.entryFee}`}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`status-badge ${row.eventStatus.toLowerCase()}`}>
                        {row.eventStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: row.confirmedCount > 0 ? 'var(--status-approved-text)' : 'var(--text-dim)'
                      }}>
                        {row.confirmedCount}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: row.pendingCount > 0 ? 'var(--status-pending-text)' : 'var(--text-dim)'
                      }}>
                        {row.pendingCount}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {row.confirmedCount} / {row.maxParticipants}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Aggregate registration counts for {filtered.length} event{filtered.length !== 1 ? 's' : ''}. Individual participant data is managed by event organizers.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
