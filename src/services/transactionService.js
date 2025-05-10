import api from './api';

export const transactionService = {
    // Get all transactions for a wallet or all transactions if no walletId provided
    getTransactions: async (walletId) => {
        const url = walletId ? `/transactions/wallet/${walletId}` : '/transactions';
        const response = await api.get(url);
        return response.data;
    },

    // Get a specific transaction
    getTransaction: async (transactionId) => {
        const response = await api.get(`/transactions/${transactionId}`);
        return response.data;
    },

    // Create a new transaction
    createTransaction: async (transactionData) => {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    },

    // Update a transaction
    updateTransaction: async (transactionId, transactionData) => {
        const response = await api.put(`/transactions/${transactionId}`, transactionData);
        return response.data;
    },

    // Delete a transaction
    deleteTransaction: async (transactionId) => {
        const response = await api.delete(`/transactions/${transactionId}`);
        return response.data;
    },

    // Get transactions by category
    getTransactionsByCategory: async (walletId, category) => {
        const response = await api.get(`/transactions/wallet/${walletId}/category/${category}`);
        return response.data;
    },

    // Get transactions by date range
    getTransactionsByDateRange: async (walletId, startDate, endDate) => {
        const response = await api.get(`/transactions/wallet/${walletId}/date-range`, {
            params: { startDate, endDate }
        });
        return response.data;
    }
}; 