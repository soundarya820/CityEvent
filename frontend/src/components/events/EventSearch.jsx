import React from 'react';
import { Search, X } from 'lucide-react';

export const EventSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
      <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search events by Name, City, Area, Category, Organizer, or Entry Type (Free/Paid)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            paddingLeft: '2.75rem',
            paddingRight: searchTerm ? '2.5rem' : '1rem',
            paddingTop: '0.85rem',
            paddingBottom: '0.85rem',
            fontSize: '1rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-card)',
            boxShadow: 'var(--shadow-sm)'
          }}
        />
        <Search
          size={20}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--primary)'
          }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            style={{
              position: 'absolute',
              right: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
        Try searching: <code style={{ color: 'var(--secondary)' }}>Free</code>, <code style={{ color: 'var(--secondary)' }}>Paid</code>, <code style={{ color: 'var(--secondary)' }}>Mumbai</code>, or <code style={{ color: 'var(--secondary)' }}>Technology</code>
      </p>
    </div>
  );
};
