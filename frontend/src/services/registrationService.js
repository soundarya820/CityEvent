import { getMockRegistrations, saveMockRegistrations, getMockEvents, saveMockEvents } from '../data/mockData.js';
import { apiClient, USE_MOCK_DATA } from './apiConfig.js';

export const registrationService = {
  /**
   * Get all registrations for a specific logged-in user
   */
  async getUserRegistrations(userId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));
      const registrations = getMockRegistrations();
      return registrations.filter((r) => r.userId === userId);
    } else {
      const response = await apiClient.get('/registrations/my-registrations');
      return response.data;
    }
  },

  /**
   * Get Registration details by ID
   */
  async getRegistrationById(registrationId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 150));
      const registrations = getMockRegistrations();
      const reg = registrations.find((r) => r.id === registrationId);
      if (!reg) throw new Error('Registration record not found.');
      return reg;
    } else {
      const response = await apiClient.get(`/registrations/${registrationId}`);
      return response.data;
    }
  },

  /**
   * Submit Free Event Registration
   */
  async createFreeRegistration({ userId, eventId, participantData }) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 400));

      const events = getMockEvents();
      const eventIndex = events.findIndex((e) => e.id === eventId);
      if (eventIndex === -1) throw new Error('Event not found.');

      const event = events[eventIndex];
      if (event.status === 'Cancelled') throw new Error('Cannot register for a cancelled event.');

      const confirmedCount = event.confirmedRegistrationsCount || 0;
      const availableSeats = Math.max(0, event.maxParticipants - confirmedCount);
      if (availableSeats <= 0) {
        throw new Error('Registration Full. No seats available for this event.');
      }

      const registrations = getMockRegistrations();
      const activeReg = registrations.find(
        (r) => r.userId === userId && r.eventId === eventId && r.status !== 'Cancelled'
      );

      if (activeReg) {
        throw new Error('You are already registered for this event.');
      }

      const newRegistration = {
        id: `reg-${Date.now()}`,
        eventId: event.id,
        eventName: event.eventName,
        userId,
        participantName: participantData.fullName.trim(),
        email: participantData.email.trim(),
        phone: participantData.phone.trim(),
        age: parseInt(participantData.age, 10),
        gender: participantData.gender,
        fromCity: participantData.fromCity.trim(),
        entryType: 'Free',
        entryFee: 0,
        paymentScreenshotUrl: null,
        submissionTime: new Date().toISOString(),
        status: 'Confirmed',
        rejectionReason: null
      };

      registrations.push(newRegistration);
      saveMockRegistrations(registrations);

      events[eventIndex].confirmedRegistrationsCount = confirmedCount + 1;
      saveMockEvents(events);

      return {
        success: true,
        message: 'Free Registration Confirmed!',
        registration: newRegistration
      };
    } else {
      const response = await apiClient.post('/registrations/free', { eventId, ...participantData });
      return response.data;
    }
  },

  /**
   * Submit Paid Event Registration
   */
  async createPaidRegistration({ userId, eventId, participantData, screenshotFile, screenshotPreviewUrl }) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 500));

      const events = getMockEvents();
      const eventIndex = events.findIndex((e) => e.id === eventId);
      if (eventIndex === -1) throw new Error('Event not found.');

      const event = events[eventIndex];
      if (event.status === 'Cancelled') throw new Error('Cannot register for a cancelled event.');

      const confirmedCount = event.confirmedRegistrationsCount || 0;
      const availableSeats = Math.max(0, event.maxParticipants - confirmedCount);
      if (availableSeats <= 0) {
        throw new Error('Registration Full. No seats available for this event.');
      }

      const registrations = getMockRegistrations();
      const activeReg = registrations.find(
        (r) => r.userId === userId && r.eventId === eventId && r.status !== 'Cancelled'
      );

      if (activeReg) {
        throw new Error('You are already registered for this event.');
      }

      if (!screenshotFile) {
        throw new Error('Payment screenshot is required for paid event registration.');
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(screenshotFile.type)) {
        throw new Error('Invalid file format. Only JPG, JPEG, and PNG images are allowed.');
      }

      const maxSize = 5 * 1024 * 1024;
      if (screenshotFile.size > maxSize) {
        throw new Error('File size exceeds the 5 MB limit. Please select a smaller image.');
      }

      const newRegistration = {
        id: `reg-${Date.now()}`,
        eventId: event.id,
        eventName: event.eventName,
        userId,
        participantName: participantData.fullName.trim(),
        email: participantData.email.trim(),
        phone: participantData.phone.trim(),
        age: parseInt(participantData.age, 10),
        gender: participantData.gender,
        fromCity: participantData.fromCity.trim(),
        entryType: 'Paid',
        entryFee: event.entryFee,
        paymentScreenshotUrl: screenshotPreviewUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
        submissionTime: new Date().toISOString(),
        status: 'Pending Verification',
        rejectionReason: null
      };

      registrations.push(newRegistration);
      saveMockRegistrations(registrations);

      return {
        success: true,
        message: 'Payment screenshot submitted! Registration status is Pending Verification.',
        registration: newRegistration
      };
    } else {
      const formData = new FormData();
      formData.append('eventId', eventId);
      formData.append('screenshot', screenshotFile);
      Object.keys(participantData).forEach((key) => formData.append(key, participantData[key]));
      const response = await apiClient.post('/registrations/paid', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  },

  /**
   * Cancel Confirmed Free Registration
   */
  async cancelFreeRegistration(registrationId, userId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      const registrations = getMockRegistrations();
      const regIndex = registrations.findIndex((r) => r.id === registrationId && r.userId === userId);

      if (regIndex === -1) {
        throw new Error('Registration record not found.');
      }

      const reg = registrations[regIndex];
      if (reg.entryType !== 'Free') {
        throw new Error('Paid registrations cannot be cancelled.');
      }

      if (reg.status !== 'Confirmed') {
        throw new Error('Only confirmed free registrations can be cancelled.');
      }

      registrations[regIndex].status = 'Cancelled';
      saveMockRegistrations(registrations);

      const events = getMockEvents();
      const eventIndex = events.findIndex((e) => e.id === reg.eventId);
      if (eventIndex !== -1 && events[eventIndex].confirmedRegistrationsCount > 0) {
        events[eventIndex].confirmedRegistrationsCount -= 1;
        saveMockEvents(events);
      }

      return {
        success: true,
        message: 'Registration successfully cancelled.'
      };
    } else {
      const response = await apiClient.post(`/registrations/${registrationId}/cancel`);
      return response.data;
    }
  },

  /**
   * Resubmit Payment Proof for Rejected Paid Registration
   */
  async resubmitPaidPayment({ registrationId, userId, screenshotFile, screenshotPreviewUrl }) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 400));

      const registrations = getMockRegistrations();
      const regIndex = registrations.findIndex((r) => r.id === registrationId && r.userId === userId);

      if (regIndex === -1) {
        throw new Error('Registration record not found.');
      }

      const reg = registrations[regIndex];
      if (reg.status !== 'Rejected') {
        throw new Error('Only rejected paid registrations can be resubmitted.');
      }

      if (!screenshotFile) {
        throw new Error('New payment screenshot is required.');
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(screenshotFile.type)) {
        throw new Error('Invalid file format. Only JPG, JPEG, and PNG images are allowed.');
      }

      const maxSize = 5 * 1024 * 1024;
      if (screenshotFile.size > maxSize) {
        throw new Error('File size exceeds 5 MB limit.');
      }

      registrations[regIndex].paymentScreenshotUrl = screenshotPreviewUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80';
      registrations[regIndex].submissionTime = new Date().toISOString();
      registrations[regIndex].status = 'Pending Verification';
      registrations[regIndex].rejectionReason = null;

      saveMockRegistrations(registrations);

      return {
        success: true,
        message: 'New payment proof submitted! Status updated to Pending Verification.',
        registration: registrations[regIndex]
      };
    } else {
      const formData = new FormData();
      formData.append('screenshot', screenshotFile);
      const response = await apiClient.post(`/registrations/${registrationId}/resubmit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  },

  /**
   * ORGANIZER METHOD: Get participant registrations for a specific event
   */
  async getEventRegistrations(eventId, organizerId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));

      // Verify event ownership
      const events = getMockEvents();
      const event = events.find((e) => e.id === eventId);
      if (!event) throw new Error('Event not found.');
      if (event.organizerId !== organizerId) {
        throw new Error('Access Denied: You do not own this event.');
      }

      const registrations = getMockRegistrations();
      return registrations.filter((r) => r.eventId === eventId);
    } else {
      const response = await apiClient.get(`/organizer/events/${eventId}/registrations`);
      return response.data;
    }
  },

  /**
   * ORGANIZER METHOD: Approve Paid Registration (Pending Verification -> Confirmed)
   */
  async approvePaidRegistration(registrationId, organizerId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      const registrations = getMockRegistrations();
      const regIndex = registrations.findIndex((r) => r.id === registrationId);
      if (regIndex === -1) throw new Error('Registration record not found.');

      const reg = registrations[regIndex];

      // Verify ownership of the event
      const events = getMockEvents();
      const eventIndex = events.findIndex((e) => e.id === reg.eventId);
      if (eventIndex === -1) throw new Error('Associated event not found.');
      if (events[eventIndex].organizerId !== organizerId) {
        throw new Error('Access Denied: You do not own this event.');
      }

      // Update status to Confirmed
      registrations[regIndex].status = 'Confirmed';
      registrations[regIndex].rejectionReason = null;
      saveMockRegistrations(registrations);

      // Increment confirmed count on event
      events[eventIndex].confirmedRegistrationsCount = (events[eventIndex].confirmedRegistrationsCount || 0) + 1;
      saveMockEvents(events);

      return {
        success: true,
        message: 'Payment verified! Registration status updated to Confirmed.',
        registration: registrations[regIndex]
      };
    } else {
      const response = await apiClient.post(`/organizer/registrations/${registrationId}/approve`);
      return response.data;
    }
  },

  /**
   * ORGANIZER METHOD: Reject Paid Registration (Pending Verification -> Rejected)
   */
  async rejectPaidRegistration(registrationId, organizerId, rejectionReason) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      if (!rejectionReason || !rejectionReason.trim()) {
        throw new Error('A rejection reason is mandatory when rejecting payment.');
      }

      const registrations = getMockRegistrations();
      const regIndex = registrations.findIndex((r) => r.id === registrationId);
      if (regIndex === -1) throw new Error('Registration record not found.');

      const reg = registrations[regIndex];

      // Verify ownership of the event
      const events = getMockEvents();
      const eventIndex = events.findIndex((e) => e.id === reg.eventId);
      if (eventIndex === -1) throw new Error('Associated event not found.');
      if (events[eventIndex].organizerId !== organizerId) {
        throw new Error('Access Denied: You do not own this event.');
      }

      // Update status to Rejected with reason
      registrations[regIndex].status = 'Rejected';
      registrations[regIndex].rejectionReason = rejectionReason.trim();
      saveMockRegistrations(registrations);

      return {
        success: true,
        message: 'Registration status updated to Rejected.',
        registration: registrations[regIndex]
      };
    } else {
      const response = await apiClient.post(`/organizer/registrations/${registrationId}/reject`, { rejectionReason });
      return response.data;
    }
  }
};
