import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based permission
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Determine user's home path
    let defaultHome = '/login';
    if (role === 'User') defaultHome = '/user/dashboard';
    else if (role === 'Organizer') defaultHome = '/organizer/dashboard';
    else if (role === 'Admin') defaultHome = '/admin/dashboard';

    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <div className="card" style={{ maxWidth: '520px', textAlign: 'center', padding: '3rem 2rem' }}>
          <ShieldAlert size={54} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            You do not have permission to access this page. Your current role is{' '}
            <strong style={{ color: 'var(--text-main)' }}>{role}</strong>.
          </p>
          <div className="alert alert-info" style={{ textAlign: 'left', fontSize: '0.85rem' }}>
            Frontend route restrictions protect navigation structure. Backend authorization will verify API permissions upon server requests.
          </div>
          <Link to={defaultHome} className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
            Return to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
};
