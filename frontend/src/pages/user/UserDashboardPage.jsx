import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Compass, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const UserDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.fullName}! 👋</h1>
          <p>User Portal • Discover and manage your local event registrations</p>
        </div>
        <span className="role-tag user" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          USER ACCOUNT
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Total Registrations</span>
            <Calendar size={22} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>1</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>Total events joined</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Upcoming Events</span>
            <CheckCircle2 size={22} color="var(--status-approved-text)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-approved-text)' }}>1</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>Confirmed upcoming events</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Pending Verification</span>
            <Clock size={22} color="var(--status-pending-text)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>0</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>Paid payment proofs pending review</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Phase 1 Foundation Ready</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Your User authentication state is active and JWT token is stored securely in <code>localStorage</code>.
          The complete post-login Event Discovery, Search, Free Registration, Paid QR/Screenshot Upload, and My Registrations history will be activated in <strong>Phase 2</strong>.
        </p>
      </div>
    </div>
  );
};
