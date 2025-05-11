import React, { useState } from 'react';
import styles from './PaymentHistory.module.css';

const PaymentHistory = ({ transactions }) => {
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filterTransactions = () => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesDateRange = (!startDate || transactionDate >= new Date(startDate)) &&
                             (!endDate || transactionDate <= new Date(endDate));
      return matchesType && matchesDateRange;
    });
  };

  const getTransactionType = (transaction) => {
    if (transaction.paymentMethod) {
      return 'payment';
    }
    return transaction.type || 'expense';
  };

  const getTransactionIcon = (transaction) => {
    const type = getTransactionType(transaction);
    switch (type) {
      case 'payment':
        return '💳';
      case 'income':
        return '💰';
      case 'expense':
        return '📝';
      default:
        return '📊';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const filteredTransactions = filterTransactions();

  return (
    <div className={styles.paymentHistory}>
      <div className={styles.header}>
        <h2 className={styles.title}>Transaction History</h2>
        <div className={styles.filters}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Transactions</option>
            <option value="payment">Payments</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
          <div className={styles.dateFilters}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No transactions found for the selected filters.</p>
        </div>
      ) : (
        <div className={styles.transactionsList}>
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionIcon}>
                {getTransactionIcon(transaction)}
              </div>
              <div className={styles.transactionInfo}>
                <div className={styles.transactionHeader}>
                  <h3>{transaction.description}</h3>
                  <span className={`${styles.amount} ${
                    transaction.amount < 0 ? styles.expense : styles.income
                  }`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </span>
                </div>
                <div className={styles.transactionDetails}>
                  <span className={styles.transactionType}>
                    {getTransactionType(transaction).toUpperCase()}
                  </span>
                  <span className={styles.date}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
                {transaction.paymentDetails && (
                  <div className={styles.paymentDetails}>
                    {transaction.paymentDetails.type === 'card' && (
                      <p>Card: •••• {transaction.paymentDetails.last4}</p>
                    )}
                    {transaction.paymentDetails.type === 'upi' && (
                      <p>UPI ID: {transaction.paymentDetails.upiId}</p>
                    )}
                    {transaction.paymentDetails.type === 'bank' && (
                      <p>Account: •••• {transaction.paymentDetails.last4}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory; 