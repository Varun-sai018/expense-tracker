import React from 'react';
import styles from './AmountInput.module.css';

const AmountInput = ({ value, onChange }) => {
  return (
    <div className={styles.formGroup}>
      <label>Amount (₹)</label>
      <input
        type="number"
        name="amount"
        value={value}
        onChange={onChange}
        placeholder="0.00"
        step="0.01"
        min="0"
        required
        className={styles.input}
      />
    </div>
  );
};

export default AmountInput; 