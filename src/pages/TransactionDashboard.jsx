import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { walletService } from '../services/walletService';
import AddTransactionForm from '../components/AddTransactionForm';
import styles from './TransactionDashboard.module.css';

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [sortBy, setSortBy] = useState('date'); // date, amount
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [transactionsData, walletsData] = await Promise.all([
        transactionService.getTransactions(),
        walletService.getWallets()
      ]);
      setTransactions(transactionsData);
      setWallets(walletsData);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    setAddLoading(true);
    setError(null);
    try {
      const newTransaction = await transactionService.createTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', err);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditTransaction = async (transactionData) => {
    setEditLoading(true);
    setError(null);
    try {
      const updated = await transactionService.updateTransaction(editTransaction.id, transactionData);
      setTransactions(prev => prev.map(t => t.id === editTransaction.id ? updated : t));
      setEditTransaction(null);
    } catch (err) {
      setError('Failed to update transaction. Please try again.');
      console.error('Error updating transaction:', err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionService.deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      console.error('Error deleting transaction:', err);
    }
  };

  const getWalletName = (walletId) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet ? wallet.name : 'Unknown Wallet';
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter === 'all') return true;
      return transaction.type === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      } else {
        return sortOrder === 'desc'
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
    });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Transaction History</h1>
        <div className={styles.controls}>
          <button
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            Add Transaction
          </button>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className={styles.sortButton}
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showAddForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add Transaction</h2>
            <AddTransactionForm
              wallets={wallets}
              onSubmit={handleAddTransaction}
              onCancel={() => setShowAddForm(false)}
              loading={addLoading}
            />
          </div>
        </div>
      )}

      {editTransaction && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Transaction</h2>
            <AddTransactionForm
              wallets={wallets}
              onSubmit={handleEditTransaction}
              onCancel={() => setEditTransaction(null)}
              loading={editLoading}
              initialData={editTransaction}
            />
          </div>
        </div>
      )}

      <div className={styles.transactionList}>
        {filteredTransactions.map(transaction => (
          <div 
            key={transaction.id} 
            className={`${styles.transactionCard} ${
              transaction.type === 'income' ? styles.income : styles.expense
            }`}
          >
            <div className={styles.transactionHeader}>
              <h3>{transaction.description}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className={styles.editButton}
                  onClick={() => setEditTransaction(transaction)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteTransaction(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className={styles.transactionDetails}>
              <p className={styles.amount}>
                {transaction.type === 'income' ? '+' : '-'}₹
                {Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className={styles.date}>
                {new Date(transaction.date).toLocaleDateString()}
              </p>
              <p className={styles.wallet}>
                Wallet: {getWalletName(transaction.walletId)}
              </p>
              {transaction.category && (
                <p className={styles.category}>
                  Category: {transaction.category}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className={styles.emptyState}>
          <p>No transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionDashboard; 