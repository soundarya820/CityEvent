import React, { useState, useEffect } from 'react';
import { getMockUsers } from '../../data/mockData';
import { Users, Calendar, Mail, UserCheck } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const allUsers = getMockUsers();
    // Filter only registered users
    const userList = allUsers.filter((u) => u.role === 'User');
    setUsers(userList);
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Registered Users Overview 👥</h1>
          <p>Read-only overview of user accounts registered on CityEvent.</p>
        </div>
        <span className="role-tag admin" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          USER OVERVIEW
        </span>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Full Name</th>
                <th style={{ padding: '1rem 1.25rem' }}>Email Address</th>
                <th style={{ padding: '1rem 1.25rem' }}>City</th>
                <th style={{ padding: '1rem 1.25rem' }}>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={16} color="var(--primary)" />
                      {u.fullName}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={14} /> {u.email}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                    {u.city || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
