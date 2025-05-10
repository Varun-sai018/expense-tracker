import React, { useState, useEffect } from 'react';

const initialState = {
  amount: '',
  description: '',
  type: 'expense',
  walletId: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
};

const categories = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Salary', 'Investment', 'Other'
];

const AddTransactionForm = ({ wallets, onSubmit, onCancel, loading, initialData }) => {
  const [form, setForm] = useState(initialData ? {
    ...initialState,
    ...initialData,
    amount: initialData.amount ? String(initialData.amount) : '',
    date: initialData.date ? initialData.date.slice(0, 10) : initialState.date,
  } : initialState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialState,
        ...initialData,
        amount: initialData.amount ? String(initialData.amount) : '',
        date: initialData.date ? initialData.date.slice(0, 10) : initialState.date,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.amount || !form.description || !form.walletId) {
      setError('Please fill all required fields.');
      return;
    }
    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
    if (!initialData) setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <div style={{ marginBottom: 12 }}>
        <label>Amount*:</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Description*:</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Type*:</label>
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Wallet*:</label>
        <select name="walletId" value={form.walletId} onChange={handleChange} required>
          <option value="">Select Wallet</option>
          {wallets.map(wallet => (
            <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Category:</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button type="submit" disabled={loading}>
          {loading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Transaction')}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm; 