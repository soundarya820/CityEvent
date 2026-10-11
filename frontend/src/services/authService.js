import { getMockUsers, saveMockUsers } from '../data/mockData.js';
import { apiClient, USE_MOCK_DATA } from './apiConfig.js';

export const authService = {
  /**
   * User, Organizer, and Admin Login
   */
  async login({ email, password, role }) {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((res) => setTimeout(res, 300));

      const users = getMockUsers();
      const formattedEmail = email.trim().toLowerCase();

      // Find user matching email and role
      const user = users.find(
        (u) => u.email.toLowerCase() === formattedEmail && u.role.toLowerCase() === role.toLowerCase()
      );

      if (!user || user.password !== password) {
        throw new Error('Invalid email, password, or selected role.');
      }

      // Generate mock JWT token
      const token = `mock-jwt-token-${user.role.toLowerCase()}-${user.id}-${Date.now()}`;

      // Save credentials in localStorage
      localStorage.setItem('cityevent_token', token);
      
      const userToStore = {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName || user.organizationName || 'User',
        organizationName: user.organizationName || null,
        contactPersonName: user.contactPersonName || null,
        phone: user.phone || '',
        city: user.city || ''
      };
      
      localStorage.setItem('cityevent_user', JSON.stringify(userToStore));

      return {
        user: userToStore,
        token
      };
    } else {
      // Backend API Call
      const response = await apiClient.post('/auth/login', { email, password, role });
      const { token, user } = response.data;
      localStorage.setItem('cityevent_token', token);
      localStorage.setItem('cityevent_user', JSON.stringify(user));
      return { user, token };
    }
  },

  /**
   * Register a new User Account
   */
  async registerUser(userData) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      const users = getMockUsers();
      const formattedEmail = userData.email.trim().toLowerCase();

      // Check if email already exists
      const existing = users.find((u) => u.email.toLowerCase() === formattedEmail);
      if (existing) {
        throw new Error('An account with this email address already exists.');
      }

      const newUser = {
        id: `user-${Date.now()}`,
        fullName: userData.fullName.trim(),
        email: formattedEmail,
        phone: userData.phone.trim(),
        city: userData.city.trim(),
        password: userData.password,
        role: 'User',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveMockUsers(users);

      return {
        success: true,
        message: 'User registration successful! Please log in to access CityEvent.'
      };
    } else {
      const response = await apiClient.post('/auth/register/user', userData);
      return response.data;
    }
  },

  /**
   * Register a new Organizer Account (No admin approval required)
   */
  async registerOrganizer(organizerData) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));

      const users = getMockUsers();
      const formattedEmail = organizerData.email.trim().toLowerCase();

      // Check if email already exists
      const existing = users.find((u) => u.email.toLowerCase() === formattedEmail);
      if (existing) {
        throw new Error('An account with this email address already exists.');
      }

      const newOrganizer = {
        id: `org-${Date.now()}`,
        organizationName: organizerData.organizationName.trim(),
        contactPersonName: organizerData.contactPersonName.trim(),
        email: formattedEmail,
        phone: organizerData.phone.trim(),
        password: organizerData.password,
        role: 'Organizer',
        createdAt: new Date().toISOString()
      };

      users.push(newOrganizer);
      saveMockUsers(users);

      return {
        success: true,
        message: 'Organizer registration successful! You can now log in and create events.'
      };
    } else {
      const response = await apiClient.post('/auth/register/organizer', organizerData);
      return response.data;
    }
  },

  /**
   * Get Current Authenticated User from Storage
   */
  getCurrentUser() {
    try {
      const token = localStorage.getItem('cityevent_token');
      const userJson = localStorage.getItem('cityevent_user');
      if (!token || !userJson) return null;
      return JSON.parse(userJson);
    } catch (err) {
      console.error('Error reading current user:', err);
      return null;
    }
  },

  /**
   * Get JWT Token
   */
  getToken() {
    return localStorage.getItem('cityevent_token');
  },

  /**
   * Logout User & Clear Token
   */
  logout() {
    localStorage.removeItem('cityevent_token');
    localStorage.removeItem('cityevent_user');
  }
};
