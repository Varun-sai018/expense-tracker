import api from './api';

export const walletService = {
    // Get all wallets for current user
    getWallets: async () => {
        const response = await api.get('/wallets');
        return response.data;
    },

    // Get a specific wallet
    getWallet: async (walletId) => {
        const response = await api.get(`/wallets/${walletId}`);
        return response.data;
    },

    // Create a new wallet
    createWallet: async (walletData) => {
        const response = await api.post('/wallets', walletData);
        return response.data;
    },

    // Update a wallet
    updateWallet: async (walletId, walletData) => {
        const response = await api.put(`/wallets/${walletId}`, walletData);
        return response.data;
    },

    // Delete a wallet
    deleteWallet: async (walletId) => {
        const response = await api.delete(`/wallets/${walletId}`);
        return response.data;
    }
}; 