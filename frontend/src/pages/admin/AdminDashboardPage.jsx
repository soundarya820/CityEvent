import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMockUsers, getMockEvents, getMockRegistrations } from '../../data/mockData';
import { Users, Building2, Calendar, Clock, CheckCircle2, XCircle, FileText, ArrowRight, Shield } from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    rejectedEvents: 0,
    totalRegistrations: 0
  });

  useEffect(() => {
    const allUsers = getMockUsers();
    const allEvents = getMockEvents();
    const allRegistrations = getMockRegistrations();

    setStats({
      totalUsers: allUsers.filter((u) => u.role === 'User').length,
      totalOrganizers: allUsers.filter((u) => u.role === 'Organizer').length,
      totalEvents: allEvents.length,
      pendingEvents: allEvents.filter((e) => e.status === 'Pending').length,
      approvedEvents: allEvents.filter((e) => e.status === 'Approved').length,
      rejectedEvents: allEvents.filter((e) => e.status === 'Rejected').length,
      totalRegistrations: allRegistrations.length
    });
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Admin Control Panel 🛡️</h1>
          <p>Platform Overview & Governance • Administrator: <strong>{user?.fullName || user?.email}</strong></p>
        </div>
        <span className="role-tag admin" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          PLATFORM ADMIN
        </span>
      </div>

      {/* 7 Requirement Statistics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* 1. Total Users */}
        <div className="card" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Users</span>
            <Users size={20} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalUsers}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
            View Users <ArrowRight size={12} />
          </span>
        </div>

        {/* 2. Total Organizers */}
        <div className="card" onClick={() => navigate('/admin/organizers')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Organizers</span>
            <Building2 size={20} color="#c084fc" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalOrganizers}</div>
          <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
            View Organizers <ArrowRight size={12} />
          </span>
        </div>

        {/* 3. Total Events */}
        <div className="card" onClick={() => navigate('/admin/events')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Events</span>
            <Calendar size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalEvents}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
            View All Events <ArrowRight size={12} />
          </span>
        </div>

        {/* 4. Pending Events */}
        <div className="card" onClick={() => navigate('/admin/events?status=Pending')} style={{ cursor: 'pointer', borderLeft: '4px solid var(--status-pending-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Pending Review</span>
            <Clock size={20} color="var(--status-pending-text)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>{stats.pendingEvents}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-pending-text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
            Review Pending <ArrowRight size={12} />
          </span>
        </div>

        {/* 5. Approved Events */}
        <div className="card" onClick={() => navigate('/admin/events?status=Approved')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Approved Events</span>
            <CheckCircle2 size={20} color="var(--status-approved-text)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-approved-text)' }}>{stats.approvedEvents}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-approved-text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
            View Approved <ArrowRight size={12} />
          </span>
        </div>

        {/* 6. Rejected Events */}
        <div className="card" onClick={() => navigate('/admin/events?status=Rejected')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Rejected Events</span>
            <XCircle size={20} color="var(--status-rejected-text)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-rejected-text)' }}>{stats.rejectedEvents}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-rejected-text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
            View Rejected <ArrowRight size={12} />
          </span>
        </div>

        {/* 7. Total Registrations */}
        <div className="card" onClick={() => navigate('/admin/registrations')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Registrations</span>
            <FileText size={20} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalRegistrations}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
            Registration Overview <ArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* Quick Navigation Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Admin Governance Modules</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/admin/events" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Calendar size={18} /> Manage All Events
          </Link>
          <Link to="/admin/categories" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Shield size={18} /> Predefined Categories
          </Link>
          <Link to="/admin/registrations" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <FileText size={18} /> Registration Overview
          </Link>
        </div>
      </div>
    </div>
  );
};
