import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { UserRegisterPage } from './pages/auth/UserRegisterPage';
import { OrganizerRegisterPage } from './pages/auth/OrganizerRegisterPage';

// Phase 2 User Pages
import { UserHomePage } from './pages/user/UserHomePage';
import { EventDetailsPage } from './pages/user/EventDetailsPage';
import { UserRegistrationsPage } from './pages/user/UserRegistrationsPage';
import { UserProfilePage } from './pages/user/UserProfilePage';

// Phase 3 Organizer Pages
import { OrganizerDashboardPage } from './pages/organizer/OrganizerDashboardPage';
import { MyEventsPage } from './pages/organizer/MyEventsPage';
import { CreateEventPage } from './pages/organizer/CreateEventPage';
import { EditEventPage } from './pages/organizer/EditEventPage';
import { OrganizerEventDetailsPage } from './pages/organizer/OrganizerEventDetailsPage';
import { EventParticipantsPage } from './pages/organizer/EventParticipantsPage';
import { OrganizerProfilePage } from './pages/organizer/OrganizerProfilePage';

// Phase 4 Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminEventReviewPage } from './pages/admin/AdminEventReviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminOrganizersPage } from './pages/admin/AdminOrganizersPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminRegistrationsPage } from './pages/admin/AdminRegistrationsPage';

// Helper component for Root Route redirect
const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'User') return <Navigate to="/user/dashboard" replace />;
  if (role === 'Organizer') return <Navigate to="/organizer/dashboard" replace />;
  if (role === 'Admin') return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Root Route */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/user" element={<UserRegisterPage />} />
            <Route path="/register/organizer" element={<OrganizerRegisterPage />} />

            {/* Protected User Routes (Phase 2) */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <UserHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/events/:eventId"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <EventDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/registrations"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <UserRegistrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Organizer Routes (Phase 3) */}
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <OrganizerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <MyEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/create"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:eventId"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <OrganizerEventDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:eventId/edit"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <EditEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:eventId/participants"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <EventParticipantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/profile"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <OrganizerProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes (Phase 4) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/:eventId"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminEventReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/organizers"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminOrganizersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminRegistrationsPage />
                </ProtectedRoute>
              }
            />

            {/* Wildcard Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
