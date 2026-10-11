import { getMockEvents, saveMockEvents } from '../data/mockData.js';
import { apiClient, USE_MOCK_DATA } from './apiConfig.js';

export const eventService = {
  /**
   * Get public discoverable events (Approved and Cancelled only)
   */
  async getPublicEvents() {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));
      const events = getMockEvents();

      const discoverableEvents = events
        .filter((e) => e.status === 'Approved' || e.status === 'Cancelled')
        .map((e) => {
          const availableSeats = Math.max(0, (e.maxParticipants || 0) - (e.confirmedRegistrationsCount || 0));
          return { ...e, availableSeats };
        });

      return discoverableEvents;
    } else {
      const response = await apiClient.get('/events/public');
      return response.data;
    }
  },

  /**
   * Get Event details by ID (Public view)
   */
  async getEventById(eventId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));
      const events = getMockEvents();
      const event = events.find((e) => e.id === eventId);

      if (!event) {
        throw new Error('Event not found.');
      }

      const availableSeats = Math.max(0, (event.maxParticipants || 0) - (event.confirmedRegistrationsCount || 0));
      return { ...event, availableSeats };
    } else {
      const response = await apiClient.get(`/events/${eventId}`);
      return response.data;
    }
  },

  /**
   * Filter discoverable events across 6 fields
   */
  async searchEvents(query = '') {
    const discoverableEvents = await this.getPublicEvents();
    if (!query || !query.trim()) {
      return discoverableEvents;
    }

    const q = query.trim().toLowerCase();

    return discoverableEvents.filter((event) => {
      const nameMatch = event.eventName?.toLowerCase().includes(q);
      const cityMatch = event.city?.toLowerCase().includes(q);
      const areaMatch = event.area?.toLowerCase().includes(q);
      const categoryMatch = event.category?.toLowerCase().includes(q);
      const organizerMatch = event.organizerName?.toLowerCase().includes(q);
      const entryTypeMatch = event.entryType?.toLowerCase().includes(q);

      return nameMatch || cityMatch || areaMatch || categoryMatch || organizerMatch || entryTypeMatch;
    });
  },

  /**
   * ORGANIZER METHOD: Get events belonging strictly to logged-in Organizer
   */
  async getOrganizerEvents(organizerId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));
      const events = getMockEvents();
      return events
        .filter((e) => e.organizerId === organizerId)
        .map((e) => {
          const availableSeats = Math.max(0, (e.maxParticipants || 0) - (e.confirmedRegistrationsCount || 0));
          return { ...e, availableSeats };
        });
    } else {
      const response = await apiClient.get('/organizer/events');
      return response.data;
    }
  },

  /**
   * ORGANIZER METHOD: Get single event with strict Ownership verification
   */
  async getOrganizerEventById(eventId, organizerId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));
      const events = getMockEvents();
      const event = events.find((e) => e.id === eventId);

      if (!event) {
        throw new Error('Event not found.');
      }

      if (event.organizerId !== organizerId) {
        throw new Error('Access Denied: You do not own this event.');
      }

      const availableSeats = Math.max(0, (event.maxParticipants || 0) - (event.confirmedRegistrationsCount || 0));
      return { ...event, availableSeats };
    } else {
      const response = await apiClient.get(`/organizer/events/${eventId}`);
      return response.data;
    }
  },

  /**
   * ORGANIZER METHOD: Create new Event (Sets status to Pending)
   */
  async createOrganizerEvent(eventData, organizer) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 400));

      const events = getMockEvents();

      const newEvent = {
        id: `event-${Date.now()}`,
        eventName: eventData.eventName.trim(),
        description: eventData.description.trim(),
        category: eventData.category,
        organizerId: organizer.id,
        organizerName: organizer.organizationName || organizer.fullName || 'Organizer',
        contactPerson: organizer.contactPersonName || organizer.fullName || 'Contact Person',
        posterUrl: eventData.posterPreviewUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        city: eventData.city.trim(),
        area: eventData.area.trim(),
        venue: eventData.venue ? eventData.venue.trim() : 'TBA',
        eventDate: eventData.eventDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        entryType: eventData.entryType,
        entryFee: eventData.entryType === 'Paid' ? parseFloat(eventData.entryFee) : 0,
        paymentQrUrl: eventData.entryType === 'Paid' ? (eventData.paymentQrPreviewUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=techevents@upi&pn=TechEventsCo') : null,
        maxParticipants: parseInt(eventData.maxParticipants, 10),
        confirmedRegistrationsCount: 0,
        status: 'Pending',
        rejectionReason: null,
        createdAt: new Date().toISOString()
      };

      events.push(newEvent);
      saveMockEvents(events);

      return {
        success: true,
        message: 'Event created successfully! Your event is now Pending Admin review.',
        event: newEvent
      };
    } else {
      const response = await apiClient.post('/organizer/events', eventData);
      return response.data;
    }
  },

  /**
   * ORGANIZER METHOD: Edit Event with status transitions
   */
  async updateOrganizerEvent({ eventId, organizerId, updatedData, isResubmit = false }) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 400));

      const events = getMockEvents();
      const index = events.findIndex((e) => e.id === eventId);

      if (index === -1) throw new Error('Event not found.');

      if (events[index].organizerId !== organizerId) {
        throw new Error('Access Denied: You do not own this event.');
      }

      const currentStatus = events[index].status;

      if (currentStatus === 'Cancelled') {
        throw new Error('Cancelled events cannot be edited.');
      }

      let newStatus = currentStatus;
      let statusNotice = '';

      if (currentStatus === 'Approved') {
        newStatus = 'Pending';
        statusNotice = ' Event status changed to Pending for Admin re-review.';
      } else if (currentStatus === 'Rejected' || isResubmit) {
        newStatus = 'Pending';
        statusNotice = ' Event resubmitted for Admin review.';
      }

      const updatedEvent = {
        ...events[index],
        eventName: updatedData.eventName.trim(),
        description: updatedData.description.trim(),
        category: updatedData.category,
        city: updatedData.city.trim(),
        area: updatedData.area.trim(),
        venue: updatedData.venue ? updatedData.venue.trim() : 'TBA',
        eventDate: updatedData.eventDate,
        startTime: updatedData.startTime,
        endTime: updatedData.endTime,
        entryType: updatedData.entryType,
        entryFee: updatedData.entryType === 'Paid' ? parseFloat(updatedData.entryFee) : 0,
        maxParticipants: parseInt(updatedData.maxParticipants, 10),
        status: newStatus,
        posterUrl: updatedData.posterPreviewUrl || events[index].posterUrl,
        paymentQrUrl: updatedData.entryType === 'Paid' ? (updatedData.paymentQrPreviewUrl || events[index].paymentQrUrl) : null
      };

      events[index] = updatedEvent;
      saveMockEvents(events);

      return {
        success: true,
        message: `Event updated successfully!${statusNotice}`,
        event: updatedEvent
      };
    } else {
      const response = await apiClient.put(`/organizer/events/${eventId}`, updatedData);
      return response.data;
    }
  },

  /**
   * ORGANIZER METHOD: Delete Pending or Rejected Event
   */
  async deletePendingOrRejectedEvent(eventId, organizerId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      const events = getMockEvents();
      const index = events.findIndex((e) => e.id === eventId);

      if (index === -1) throw new Error('Event not found.');

      if (events[index].organizerId !== organizerId) {
        throw new Error('Access Denied: You do not own this event.');
      }

      const status = events[index].status;
      if (status !== 'Pending' && status !== 'Rejected') {
        throw new Error('Only Pending or Rejected events can be deleted.');
      }

      events.splice(index, 1);
      saveMockEvents(events);

      return {
        success: true,
        message: 'Event deleted successfully.'
      };
    } else {
      const response = await apiClient.delete(`/organizer/events/${eventId}`);
      return response.data;
    }
  },

  /**
   * ORGANIZER METHOD: Cancel Approved Event (Approved -> Cancelled)
   */
  async cancelApprovedEvent(eventId, organizerId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      const events = getMockEvents();
      const index = events.findIndex((e) => e.id === eventId);

      if (index === -1) throw new Error('Event not found.');

      if (events[index].organizerId !== organizerId) {
        throw new Error('Access Denied: You do not own this event.');
      }

      if (events[index].status !== 'Approved') {
        throw new Error('Only Approved events can be cancelled.');
      }

      events[index].status = 'Cancelled';
      saveMockEvents(events);

      return {
        success: true,
        message: 'Approved event has been cancelled.',
        event: events[index]
      };
    } else {
      const response = await apiClient.post(`/organizer/events/${eventId}/cancel`);
      return response.data;
    }
  },

  /**
   * ADMIN METHOD: Get All Events across all organizers (Filterable by status)
   */
  async getAllEvents(statusFilter = 'All') {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));
      const events = getMockEvents();

      let filtered = events;
      if (statusFilter && statusFilter !== 'All') {
        filtered = events.filter((e) => e.status === statusFilter);
      }

      return filtered.map((e) => {
        const availableSeats = Math.max(0, (e.maxParticipants || 0) - (e.confirmedRegistrationsCount || 0));
        return { ...e, availableSeats };
      });
    } else {
      const response = await apiClient.get('/admin/events', { params: { status: statusFilter } });
      return response.data;
    }
  },

  /**
   * ADMIN METHOD: Approve Pending Event (Pending -> Approved)
   */
  async approveEvent(eventId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      const events = getMockEvents();
      const index = events.findIndex((e) => e.id === eventId);
      if (index === -1) throw new Error('Event not found.');

      if (events[index].status !== 'Pending') {
        throw new Error(`Only Pending events can be approved. Current status is ${events[index].status}.`);
      }

      events[index].status = 'Approved';
      events[index].rejectionReason = null;
      saveMockEvents(events);

      return {
        success: true,
        message: 'Event approved successfully! It is now publicly discoverable by logged-in users.',
        event: events[index]
      };
    } else {
      const response = await apiClient.post(`/admin/events/${eventId}/approve`);
      return response.data;
    }
  },

  /**
   * ADMIN METHOD: Reject Pending Event (Pending -> Rejected with mandatory reason)
   */
  async rejectEvent(eventId, rejectionReason) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      if (!rejectionReason || !rejectionReason.trim()) {
        throw new Error('A rejection reason is mandatory when rejecting an event.');
      }

      const events = getMockEvents();
      const index = events.findIndex((e) => e.id === eventId);
      if (index === -1) throw new Error('Event not found.');

      if (events[index].status !== 'Pending') {
        throw new Error(`Only Pending events can be rejected. Current status is ${events[index].status}.`);
      }

      events[index].status = 'Rejected';
      events[index].rejectionReason = rejectionReason.trim();
      saveMockEvents(events);

      return {
        success: true,
        message: 'Event status updated to Rejected.',
        event: events[index]
      };
    } else {
      const response = await apiClient.post(`/admin/events/${eventId}/reject`, { rejectionReason });
      return response.data;
    }
  }
};
