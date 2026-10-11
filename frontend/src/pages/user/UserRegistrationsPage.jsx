import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { registrationService } from '../../services/registrationService';
import { RegistrationDetailsModal } from '../../components/user/RegistrationDetailsModal';
import { ResubmitPaymentModal } from '../../components/user/ResubmitPaymentModal';
import { Ticket, Calendar, AlertCircle, Eye, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react';

export const UserRegistrationsPage = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedReg, setSelectedReg] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      if (user) {
        const data = await registrationService.getUserRegistrations(user.id);
        setRegistrations(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  const handleOpenDetails = (reg) => {
    setSelectedReg(reg);
    setShowDetailsModal(true);
  };

  const handleOpenResubmit = (reg) => {
    setSelectedReg(reg);
    setShowResubmitModal(true);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>My Event Registrations 🎟️</h1>
          <p>View your registration status, payment verification history, and details.</p>
        </div>
        <span className="role-tag user" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          USER REGISTRATIONS
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : registrations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '540px', margin: '2rem auto' }}>
          <Ticket size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Registrations Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            You haven't registered for any events yet. Explore discoverable events in your city and book your seat!
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Event Name</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Participant</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Entry Type</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Registration Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                      {reg.eventName}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                      {reg.participantName}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontWeight: 700, color: reg.entryType === 'Free' ? 'var(--status-approved-text)' : 'var(--primary)' }}>
                        {reg.entryType === 'Free' ? 'FREE' : `Paid (₹${reg.entryFee})`}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(reg.submissionTime).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`status-badge ${reg.status.toLowerCase().replaceAll(' ', '-')}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenDetails(reg)}
                          title="View Details"
                        >
                          <Eye size={15} /> View
                        </button>

                        {/* If Rejected Paid Registration, offer direct Resubmit action button */}
                        {reg.status === 'Rejected' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenResubmit(reg)}
                            title="Resubmit Payment Proof"
                          >
                            <RefreshCw size={15} /> Resubmit Proof
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedReg && (
        <RegistrationDetailsModal
          registration={selectedReg}
          userId={user?.id}
          onClose={() => setShowDetailsModal(false)}
          onRefresh={fetchRegistrations}
        />
      )}

      {/* Resubmit Payment Modal */}
      {showResubmitModal && selectedReg && (
        <ResubmitPaymentModal
          registration={selectedReg}
          userId={user?.id}
          onClose={() => setShowResubmitModal(false)}
          onSuccess={fetchRegistrations}
        />
      )}
    </div>
  );
};
