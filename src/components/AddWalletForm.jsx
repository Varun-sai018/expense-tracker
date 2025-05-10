import React, { useState } from 'react';
import styles from './AddWalletForm.module.css';

// List of major Indian banks
const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'Bank of India',
  'Indian Bank',
  'Central Bank of India',
  'IDBI Bank',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
  'Yes Bank',
  'Federal Bank',
  'RBL Bank',
  'IDFC FIRST Bank',
  'Bandhan Bank',
  'AU Small Finance Bank',
  'Other Bank'
];

const AddWalletForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'bank',
    name: '',
    accountNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    ifscCode: '',
    holderName: '',
    otherBankName: '', // New field for other bank name
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (formData.type === 'bank') {
      if (formData.bankName === 'Other Bank' && !formData.otherBankName) {
        newErrors.otherBankName = 'Please specify bank name';
      } else if (!formData.bankName) {
        newErrors.bankName = 'Bank name is required';
      }
      if (!formData.accountNumber) {
        newErrors.accountNumber = 'Account number is required';
      }
      if (!formData.ifscCode) {
        newErrors.ifscCode = 'IFSC code is required';
      }
    } else if (formData.type === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      }
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      }
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      }
    } else if (formData.type === 'upi') {
      if (!formData.upiId) {
        newErrors.upiId = 'UPI ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const finalBankName = formData.bankName === 'Other Bank' ? formData.otherBankName : formData.bankName;
      await onSubmit({
        ...formData,
        bankName: finalBankName
      });
      // Reset form on success
      setFormData({
        type: 'bank',
        name: '',
        accountNumber: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        upiId: '',
        bankName: '',
        ifscCode: '',
        holderName: '',
        otherBankName: '',
      });
    } catch (error) {
      console.error('Error adding wallet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Add New Wallet/Account</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="bank">Bank Account</option>
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="wallet">Digital Wallet</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter wallet/account name"
            className={styles.input}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        {formData.type === 'bank' && (
          <>
            <div className={styles.formGroup}>
              <label>Bank Name</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select Bank</option>
                {BANKS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              {errors.bankName && <span className={styles.error}>{errors.bankName}</span>}
            </div>

            {formData.bankName === 'Other Bank' && (
              <div className={styles.formGroup}>
                <label>Specify Bank Name</label>
                <input
                  type="text"
                  name="otherBankName"
                  value={formData.otherBankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className={styles.input}
                />
                {errors.otherBankName && <span className={styles.error}>{errors.otherBankName}</span>}
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className={styles.input}
              />
              {errors.accountNumber && <span className={styles.error}>{errors.accountNumber}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
                className={styles.input}
              />
              {errors.ifscCode && <span className={styles.error}>{errors.ifscCode}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Account Holder Name</label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleChange}
                placeholder="Enter account holder name"
                className={styles.input}
              />
            </div>
          </>
        )}

        {formData.type === 'card' && (
          <>
            <div className={styles.formGroup}>
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formatCardNumber(formData.cardNumber)}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={styles.input}
              />
              {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formatExpiryDate(formData.expiryDate)}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={styles.input}
                />
                {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
              </div>
              <div className={styles.formGroup}>
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="3"
                  className={styles.input}
                />
                {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Card Holder Name</label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleChange}
                placeholder="Enter card holder name"
                className={styles.input}
              />
            </div>
          </>
        )}

        {formData.type === 'upi' && (
          <div className={styles.formGroup}>
            <label>UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="username@upi"
              className={styles.input}
            />
            {errors.upiId && <span className={styles.error}>{errors.upiId}</span>}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onCancel}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles.button} ${styles.submitButton}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Wallet/Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWalletForm; 