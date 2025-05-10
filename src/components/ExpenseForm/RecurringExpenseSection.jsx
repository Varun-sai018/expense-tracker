import React from 'react';
import styles from './RecurringExpenseSection.module.css';

const RecurringExpenseSection = ({ formData, onChange }) => {
  return (
    <div className={styles.recurringSection}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="isRecurring"
          checked={formData.isRecurring}
          onChange={onChange}
        />
        <span>Recurring Expense</span>
      </label>

      {formData.isRecurring && (
        <div className={styles.recurringOptions}>
          <div className={styles.selectGroup}>
            <label>Frequency</label>
            <select
              name="recurringFrequency"
              value={formData.recurringFrequency}
              onChange={onChange}
              className={styles.select}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {formData.recurringFrequency === 'monthly' && (
            <div className={styles.selectGroup}>
              <label>Day of Month</label>
              <select
                name="recurringDay"
                value={formData.recurringDay}
                onChange={onChange}
                className={styles.select}
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Day {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecurringExpenseSection; 