import React, { useState, useEffect } from 'react';
import { getMockUsers } from '../../data/mockData';
import { Building2, User, Mail, Phone } from 'lucide-react';

export const AdminOrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    const allUsers = getMockUsers();
    // Filter registered organizers
    const orgList = allUsers.filter((u) => u.role === 'Organizer');
    setOrganizers(orgList);
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Registered Organizers Overview 🏢</h1>
          <p>Read-only overview of event organizer accounts on CityEvent.</p>
        </div>
        <span className="role-tag admin" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          ORGANIZER OVERVIEW
        </span>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Organization Name</th>
                <th style={{ padding: '1rem 1.25rem' }}>Contact Person</th>
                <th style={{ padding: '1rem 1.25rem' }}>Email Address</th>
                <th style={{ padding: '1rem 1.25rem' }}>Phone Number</th>
                <th style={{ padding: '1rem 1.25rem' }}>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {organizers.map((org) => (
                <tr key={org.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={16} color="#c084fc" />
                      {org.organizationName || org.fullName}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={14} /> {org.contactPersonName || org.fullName}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={14} /> {org.email}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Phone size={14} /> {org.phone}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(org.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
