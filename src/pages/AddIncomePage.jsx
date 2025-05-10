import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddIncomePage.module.css';

const AddIncomePage = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      setToast({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    onSubmit(formData);
    setToast({
      type: 'success',
      message: 'Income added successfully!'
    });

    // Reset form
    setFormData({
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });

    // Navigate back to dashboard after 2 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Add New Income</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={styles.input}
            placeholder="Amount"
            step="0.01"
            min="0"
            required
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.input}
            placeholder="Description"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Select a category</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="investment">Investment</option>
            <option value="gift">Gift</option>
            <option value="other">Other</option>
          </select>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Add Income
          </button>
        </form>
        {toast && (
          <div className={styles.toast} style={{ background: toast.type === 'success' ? '#28a745' : '#dc3545' }}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddIncomePage; 