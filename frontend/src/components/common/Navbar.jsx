import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, LogOut, User as UserIcon, LayoutDashboard, Compass, Ticket, Plus, Building2, Tag, FileText, Users } from 'lucide-react';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? `/${role?.toLowerCase()}/dashboard` : '/login'} className="brand-logo">
          <Calendar size={26} color="var(--primary)" />
          CityEvent
          <span className="brand-badge">Platform</span>
        </Link>

        {isAuthenticated && (
          <ul className="nav-links">
            {role === 'User' && (
              <>
                <li>
                  <Link to="/user/dashboard" className={`nav-link ${isActive('/user/dashboard') ? 'active' : ''}`}>
                    <Compass size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Event Discovery
                  </Link>
                </li>
                <li>
                  <Link to="/user/registrations" className={`nav-link ${isActive('/user/registrations') ? 'active' : ''}`}>
                    <Ticket size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    My Registrations
                  </Link>
                </li>
                <li>
                  <Link to="/user/profile" className={`nav-link ${isActive('/user/profile') ? 'active' : ''}`}>
                    <UserIcon size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Profile
                  </Link>
                </li>
              </>
            )}

            {role === 'Organizer' && (
              <>
                <li>
                  <Link to="/organizer/dashboard" className={`nav-link ${isActive('/organizer/dashboard') ? 'active' : ''}`}>
                    <LayoutDashboard size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/organizer/events" className={`nav-link ${isActive('/organizer/events') ? 'active' : ''}`}>
                    <Calendar size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    My Events
                  </Link>
                </li>
                <li>
                  <Link to="/organizer/events/create" className={`nav-link ${isActive('/organizer/events/create') ? 'active' : ''}`}>
                    <Plus size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link to="/organizer/profile" className={`nav-link ${isActive('/organizer/profile') ? 'active' : ''}`}>
                    <Building2 size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Profile
                  </Link>
                </li>
              </>
            )}

            {role === 'Admin' && (
              <>
                <li>
                  <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                    <LayoutDashboard size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/events" className={`nav-link ${location.pathname.startsWith('/admin/events') ? 'active' : ''}`}>
                    <Calendar size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/admin/categories" className={`nav-link ${isActive('/admin/categories') ? 'active' : ''}`}>
                    <Tag size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/admin/registrations" className={`nav-link ${isActive('/admin/registrations') ? 'active' : ''}`}>
                    <FileText size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Registrations
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                    <Users size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Users
                  </Link>
                </li>
                <li>
                  <Link to="/admin/organizers" className={`nav-link ${isActive('/admin/organizers') ? 'active' : ''}`}>
                    <Building2 size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Organizers
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <div className="user-profile-badge">
                <span className={`role-tag ${role?.toLowerCase()}`}>{role}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.organizationName || user?.fullName}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-sm btn-danger" title="Logout">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-sm btn-secondary">
                Login
              </Link>
              <Link to="/register/user" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
