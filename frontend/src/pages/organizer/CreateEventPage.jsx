import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { getMockCategories } from '../../data/mockData';
import { Calendar, MapPin, Building2, Ticket, QrCode, Upload, ArrowLeft, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const CreateEventPage = () => {
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

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const catList = getMockCategories();
    setCategories(catList);
    if (catList.length > 0) {
      setFormData((prev) => ({ ...prev, category: catList[0].name }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    setApiError('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setApiError('Invalid poster file format. Only JPG, JPEG, and PNG images are allowed.');
      setPosterFile(null);
      setPosterPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApiError('Poster image file size exceeds the 5 MB limit.');
      setPosterFile(null);
      setPosterPreview(null);
      return;
    }

    setPosterFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPosterPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleQrChange = (e) => {
    const file = e.target.files[0];
    setApiError('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setApiError('Invalid QR code file format. Only JPG, JPEG, and PNG images are allowed.');
      setQrFile(null);
      setQrPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApiError('Payment QR code file size exceeds the 5 MB limit.');
      setQrFile(null);
      setQrPreview(null);
      return;
    }

    setQrFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!formData.eventName.trim()) errs.eventName = 'Event Name is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    if (!formData.category) errs.category = 'Category is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.area.trim()) errs.area = 'Area is required.';
    if (!formData.eventDate) errs.eventDate = 'Event Date is required.';
    if (!formData.startTime) errs.startTime = 'Start Time is required.';
    if (!formData.endTime) errs.endTime = 'End Time is required.';

    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      errs.endTime = 'End time must be later than start time.';
    }

    if (!formData.maxParticipants || parseInt(formData.maxParticipants, 10) <= 0) {
      errs.maxParticipants = 'Maximum participants must be a positive number.';
    }

    if (!posterPreview) {
      errs.poster = 'Event Poster image is required.';
    }

    if (formData.entryType === 'Paid') {
      if (!formData.entryFee || parseFloat(formData.entryFee) <= 0) {
        errs.entryFee = 'Entry Fee must be a positive amount.';
      }
      if (!qrPreview) {
        errs.paymentQr = 'Payment QR Code image is required for paid events.';
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
      const res = await eventService.createOrganizerEvent(
        {
          ...formData,
          posterPreviewUrl: posterPreview,
          paymentQrPreviewUrl: qrPreview
        },
        user
      );

      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/organizer/events');
      }, 1500);
    } catch (err) {
      setApiError(err.message || 'Failed to create event. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/organizer/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="card">
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>Create New Event</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Submit your event details. Newly created events are submitted with <strong>Pending</strong> status for Admin review.
          </p>
        </div>

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
          {/* Section 1: Basic Information */}
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
            1. Basic Information
          </h4>

          <div className="form-group">
            <label className="form-label" htmlFor="eventName">Event Name *</label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              className="form-input"
              placeholder="e.g. Mumbai Tech Summit 2026"
              value={formData.eventName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.eventName && <span className="form-error-msg"><AlertCircle size={14} /> {errors.eventName}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Predefined Category *</label>
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
              {errors.category && <span className="form-error-msg"><AlertCircle size={14} /> {errors.category}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="maxParticipants">Maximum Participants (Seats) *</label>
              <input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="1"
                className="form-input"
                placeholder="100"
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
              placeholder="Provide complete details about schedule, speakers, agendas, or prerequisites..."
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.description && <span className="form-error-msg"><AlertCircle size={14} /> {errors.description}</span>}
          </div>

          {/* Event Poster Upload */}
          <div className="form-group">
            <label className="form-label" htmlFor="posterUpload">Event Poster Image (JPG/JPEG/PNG, Max 5 MB) *</label>
            <div style={{ border: '2px dashed var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--bg-input)' }}>
              <input
                id="posterUpload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handlePosterChange}
                disabled={isSubmitting}
                style={{ display: 'none' }}
              />
              <label htmlFor="posterUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={26} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click to select Event Poster</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Supported formats: JPG, JPEG, PNG (Max 5 MB)</span>
              </label>

              {posterPreview && (
                <div style={{ marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Poster Preview:</span>
                  <img src={posterPreview} alt="Poster Preview" style={{ maxHeight: '150px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                </div>
              )}
            </div>
            {errors.poster && <span className="form-error-msg"><AlertCircle size={14} /> {errors.poster}</span>}
          </div>

          {/* Section 2: Location Information */}
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '1.5rem', marginBottom: '1rem' }}>
            2. Location Information
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="city">City *</label>
              <input
                id="city"
                name="city"
                type="text"
                className="form-input"
                placeholder="Mumbai"
                value={formData.city}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.city && <span className="form-error-msg"><AlertCircle size={14} /> {errors.city}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="area">Area *</label>
              <input
                id="area"
                name="area"
                type="text"
                className="form-input"
                placeholder="Bandra West"
                value={formData.area}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.area && <span className="form-error-msg"><AlertCircle size={14} /> {errors.area}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="venue">Venue (Optional)</label>
              <input
                id="venue"
                name="venue"
                type="text"
                className="form-input"
                placeholder="Convention Center / Hall"
                value={formData.venue}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Section 3: Schedule Information */}
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '1.5rem', marginBottom: '1rem' }}>
            3. Schedule Information
          </h4>

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
              {errors.eventDate && <span className="form-error-msg"><AlertCircle size={14} /> {errors.eventDate}</span>}
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
              {errors.startTime && <span className="form-error-msg"><AlertCircle size={14} /> {errors.startTime}</span>}
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
              {errors.endTime && <span className="form-error-msg"><AlertCircle size={14} /> {errors.endTime}</span>}
            </div>
          </div>

          {/* Section 4: Entry & Pricing */}
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '1.5rem', marginBottom: '1rem' }}>
            4. Entry & Pricing Information
          </h4>

          <div className="form-group">
            <label className="form-label">Entry Type *</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="entryType"
                  value="Free"
                  checked={formData.entryType === 'Free'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                /> Free Entry
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="entryType"
                  value="Paid"
                  checked={formData.entryType === 'Paid'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                /> Paid Entry
              </label>
            </div>
          </div>

          {formData.entryType === 'Paid' && (
            <div style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="entryFee">Entry Fee (₹) *</label>
                <input
                  id="entryFee"
                  name="entryFee"
                  type="number"
                  min="1"
                  step="1"
                  className="form-input"
                  placeholder="499"
                  value={formData.entryFee}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.entryFee && <span className="form-error-msg"><AlertCircle size={14} /> {errors.entryFee}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="qrUpload">Upload Payment QR Code Image (JPG/JPEG/PNG, Max 5 MB) *</label>
                <div style={{ border: '2px dashed var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--bg-card)' }}>
                  <input
                    id="qrUpload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleQrChange}
                    disabled={isSubmitting}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="qrUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <QrCode size={24} color="var(--primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to select Payment QR Code</span>
                  </label>

                  {qrPreview && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>QR Preview:</span>
                      <img src={qrPreview} alt="QR Code Preview" style={{ maxHeight: '120px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: '#fff', padding: '0.3rem' }} />
                    </div>
                  )}
                </div>
                {errors.paymentQr && <span className="form-error-msg"><AlertCircle size={14} /> {errors.paymentQr}</span>}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/organizer/dashboard" className="btn btn-secondary" disabled={isSubmitting}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Event...' : 'Submit Event for Admin Review'} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
