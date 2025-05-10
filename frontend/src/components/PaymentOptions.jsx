import React, { useState } from 'react';
import styles from './PaymentOptions.module.css';

const PaymentOptions = ({ onPaymentSelect, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      const formattedValue = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setExpiryDate(formattedValue);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleUpiIdChange = (e) => {
    setUpiId(e.target.value);
  };

  const handleBankAccountChange = (e) => {
    setBankAccount(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    if (onPaymentSelect) {
      onPaymentSelect(method);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const paymentData = {
        amount: parseFloat(amount),
        description,
        paymentMethod: selectedMethod,
        ...(selectedMethod === 'card' && {
          cardNumber,
          expiryDate,
          cvv
        }),
        ...(selectedMethod === 'upi' && {
          upiId
        }),
        ...(selectedMethod === 'bank' && {
          accountNumber: bankAccount
        })
      };

      if (onPaymentComplete) {
        onPaymentComplete(paymentData);
      }

      // Reset form
      setAmount('');
      setDescription('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setUpiId('');
      setBankAccount('');
      setSelectedMethod(null);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with your card',
      icon: '💳',
      brands: ['visa', 'mastercard', 'amex']
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay via UPI',
      icon: '📱'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with PayPal',
      icon: '🔵'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: '🏦'
    }
  ];

  return (
    <div className={styles.paymentContainer}>
      <h2 className={styles.paymentTitle}>Make a Payment</h2>
      
      <form onSubmit={handlePaymentSubmit} className={styles.paymentForm}>
        <div className={styles.formGroup}>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="What's this payment for?"
            required
          />
        </div>

        <div className={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`${styles.paymentMethod} ${
                selectedMethod === method.id ? styles.selected : ''
              }`}
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <div className={styles.paymentIcon}>{method.icon}</div>
              <div className={styles.paymentInfo}>
                <h3>{method.name}</h3>
                <p>{method.description}</p>
                {method.brands && (
                  <div className={styles.brandIcons}>
                    {method.brands.map((brand) => (
                      <div key={brand} className={`${styles.brandIcon} ${styles[brand]}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedMethod === 'card' && (
          <div className={styles.cardDetails}>
            <div className={styles.formGroup}>
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'upi' && (
          <div className={styles.formGroup}>
            <label>UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={handleUpiIdChange}
              placeholder="username@upi"
              required
            />
          </div>
        )}

        {selectedMethod === 'bank' && (
          <div className={styles.formGroup}>
            <label>Bank Account Number</label>
            <input
              type="text"
              value={bankAccount}
              onChange={handleBankAccountChange}
              placeholder="Enter your bank account number"
              required
            />
          </div>
        )}

        <button
          className={styles.payButton}
          disabled={!selectedMethod || isProcessing}
          type="submit"
        >
          {isProcessing ? 'Processing...' : 'Proceed to Pay'}
        </button>

        <div className={styles.secureBadge}>
          🔒 Your payment information is secure and encrypted
        </div>
      </form>
    </div>
  );
};

export default PaymentOptions; 