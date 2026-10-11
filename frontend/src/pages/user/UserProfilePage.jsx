import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Lock, CheckCircle2 } from 'lucide-react';

export const UserProfilePage = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg('Profile updated successfully!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>My Profile 👤</h1>
          <p>Manage your user profile and account details.</p>
        </div>
        <span className="role-tag user" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          USER PROFILE
        </span>
      </div>

      <div className="card">
        {savedMsg && (
          <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} />
            <span>{savedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="fullName"
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address (Read-only)</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-input"
                value={user?.email || ''}
                readOnly
                disabled
                style={{ paddingLeft: '2.5rem', opacity: 0.7, cursor: 'not-allowed' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone"
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Phone size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">City</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="city"
                  type="text"
                  className="form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <MapPin size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
