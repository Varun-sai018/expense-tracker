import api from './api';

export const userService = {
    // Register a new user
    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        return response.data;
    },

    // Update user password
    updatePassword: async (passwordData) => {
        const response = await api.put('/users/password', passwordData);
        return response.data;
    },

    // Update user preferences
    updatePreferences: async (preferences) => {
        const response = await api.put('/users/preferences', preferences);
        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
    }
}; 