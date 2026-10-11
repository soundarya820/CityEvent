import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('User'); // User, Organizer, Admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Validate form client-side
  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { user } = await login(email, password, selectedRole);
      
      // Redirect according to authenticated role
      const redirectPath =
        location.state?.from?.pathname ||
        (user.role === 'Admin'
          ? '/admin/dashboard'
          : user.role === 'Organizer'
          ? '/organizer/dashboard'
          : '/user/dashboard');

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill demo credentials for presentation demo
  const fillDemo = (role) => {
    setSelectedRole(role);
    setErrors({});
    setApiError('');
    if (role === 'User') {
      setEmail('user@cityevent.com');
      setPassword('user123');
    } else if (role === 'Organizer') {
      setEmail('organizer@cityevent.com');
      setPassword('organizer123');
    } else if (role === 'Admin') {
      setEmail('admin@cityevent.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome to CityEvent</h1>
          <p>Local Event Discovery & Management Platform</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.4rem' }}>
            Login As:
          </label>
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${selectedRole === 'User' ? 'active' : ''}`}
              onClick={() => setSelectedRole('User')}
            >
              User
            </button>
            <button
              type="button"
              className={`role-tab ${selectedRole === 'Organizer' ? 'active' : ''}`}
              onClick={() => setSelectedRole('Organizer')}
            >
              Organizer
            </button>
            <button
              type="button"
              className={`role-tab ${selectedRole === 'Admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('Admin')}
            >
              Admin
            </button>
          </div>
        </div>

        {apiError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={18}
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
            </div>
            {errors.email && (
              <span className="form-error-msg">
                <AlertCircle size={14} /> {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock
                size={18}
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
            </div>
            {errors.password && (
              <span className="form-error-msg">
                <AlertCircle size={14} /> {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
            {isSubmitting ? (
              <>
                <div className="spinner" />
                Logging in...
              </>
            ) : (
              <>
                Login as {selectedRole} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill for Evaluators */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '0.5rem' }}>
            Quick Demo Accounts (College Evaluation):
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => fillDemo('User')}>
              User Demo
            </button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => fillDemo('Organizer')}>
              Organizer Demo
            </button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => fillDemo('Admin')}>
              Admin Demo
            </button>
          </div>
        </div>

        {/* Public Registration Links */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '0.4rem' }}>
            Don't have an account?{' '}
            <Link to="/register/user" style={{ fontWeight: 700 }}>
              Register as User
            </Link>
          </p>
          <p>
            Are you an Event Organizer?{' '}
            <Link to="/register/organizer" style={{ fontWeight: 700 }}>
              Register as Organizer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
