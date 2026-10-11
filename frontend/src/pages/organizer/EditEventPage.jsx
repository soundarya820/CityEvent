import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { getMockCategories } from '../../data/mockData';
import { ArrowLeft, AlertCircle, CheckCircle2, AlertTriangle, RefreshCw, Save } from 'lucide-react';

export const EditEventPage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    category: '',
    city: '',
    area: '',
    venue: '',
    eventDate: '',
    startTime: '10:00',
    endTime: '17:00',
    entryType: 'Free',
    entryFee: '',
    maxParticipants: ''
  });

  const [originalStatus, setOriginalStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [posterPreview, setPosterPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const catList = getMockCategories();
        setCategories(catList);

        const ev = await eventService.getOrganizerEventById(eventId, user?.id);
        setOriginalStatus(ev.status);
        setRejectionReason(ev.rejectionReason || '');

        setFormData({
          eventName: ev.eventName,
          description: ev.description,
          category: ev.category,
          city: ev.city,
          area: ev.area,
          venue: ev.venue || '',
          eventDate: ev.eventDate,
          startTime: ev.startTime,
          endTime: ev.endTime,
          entryType: ev.entryType,
          entryFee: ev.entryFee || '',
          maxParticipants: ev.maxParticipants
        });

        setPosterPreview(ev.posterUrl);
        setQrPreview(ev.paymentQrUrl);
      } catch (err) {
        setApiError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchEvent();
  }, [eventId, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setApiError('Poster size exceeds 5 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPosterPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleQrChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setApiError('QR Code size exceeds 5 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setQrPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!formData.eventName.trim()) errs.eventName = 'Event Name is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.area.trim()) errs.area = 'Area is required.';
    if (!formData.eventDate) errs.eventDate = 'Event Date is required.';
    if (!formData.maxParticipants || parseInt(formData.maxParticipants, 10) <= 0) {
      errs.maxParticipants = 'Maximum participants must be a positive number.';
    }

    if (formData.entryType === 'Paid') {
      if (!formData.entryFee || parseFloat(formData.entryFee) <= 0) {
        errs.entryFee = 'Entry fee must be a positive amount.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await eventService.updateOrganizerEvent({
        eventId,
        organizerId: user.id,
        updatedData: {
          ...formData,
          posterPreviewUrl: posterPreview,
          paymentQrPreviewUrl: qrPreview
        },
        isResubmit: originalStatus === 'Rejected'
      });

      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/organizer/events');
      }, 1500);
    } catch (err) {
      setApiError(err.message || 'Failed to update event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
      </div>
    );
  }

  if (originalStatus === 'Cancelled') {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="card">
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2>Cancelled Events Cannot Be Edited</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            This event has been cancelled and its specifications are locked.
          </p>
          <Link to="/organizer/events" className="btn btn-primary">
            Back to My Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/organizer/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Back to My Events
      </Link>

      <div className="card">
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Edit Event</h1>
            <span className={`status-badge ${originalStatus.toLowerCase()}`}>{originalStatus}</span>
          </div>
        </div>

        {/* Status Transition Warnings */}
        {originalStatus === 'Approved' && (
          <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>Notice:</strong> Making a meaningful edit to an Approved event will change its status to <strong>Pending</strong> for Admin review again.
            </span>
          </div>
        )}

        {originalStatus === 'Rejected' && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Rejection Reason from Admin:</strong>
              <span>{rejectionReason || 'Specifications incomplete.'}</span>
            </div>
          </div>
        )}

        {apiError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{apiError}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="eventName">Event Name *</label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              className="form-input"
              value={formData.eventName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.eventName && <span className="form-error-msg"><AlertCircle size={14} /> {errors.eventName}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="maxParticipants">Max Participants *</label>
              <input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="1"
                className="form-input"
                value={formData.maxParticipants}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.maxParticipants && <span className="form-error-msg"><AlertCircle size={14} /> {errors.maxParticipants}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Event Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="city">City *</label>
              <input
                id="city"
                name="city"
                type="text"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="area">Area *</label>
              <input
                id="area"
                name="area"
                type="text"
                className="form-input"
                value={formData.area}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="venue">Venue</label>
              <input
                id="venue"
                name="venue"
                type="text"
                className="form-input"
                value={formData.venue}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="eventDate">Event Date *</label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                className="form-input"
                value={formData.eventDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="startTime">Start Time *</label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                className="form-input"
                value={formData.startTime}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="endTime">End Time *</label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                className="form-input"
                value={formData.endTime}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/organizer/events" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {originalStatus === 'Rejected' ? (
                <>
                  <RefreshCw size={16} /> Save & Resubmit Event
                </>
              ) : (
                <>
                  <Save size={16} /> Save Event Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
