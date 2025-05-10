import React, { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import AddWalletForm from '../components/AddWalletForm';
import styles from './WalletDashboard.module.css';

const WalletDashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await walletService.getWallets();
      setWallets(data);
    } catch (err) {
      setError('Failed to fetch wallets. Please try again.');
      console.error('Error fetching wallets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWallet = async (walletData) => {
    try {
      const newWallet = await walletService.createWallet(walletData);
      setWallets(prev => [...prev, newWallet]);
      setShowAddWallet(false);
    } catch (err) {
      setError('Failed to create wallet. Please try again.');
      console.error('Error creating wallet:', err);
    }
  };

  const handleUpdateWallet = async (walletId, walletData) => {
    try {
      const updatedWallet = await walletService.updateWallet(walletId, walletData);
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId ? updatedWallet : wallet
      ));
      setSelectedWallet(null);
    } catch (err) {
      setError('Failed to update wallet. Please try again.');
      console.error('Error updating wallet:', err);
    }
  };

  const handleDeleteWallet = async (walletId) => {
    if (!window.confirm('Are you sure you want to delete this wallet?')) {
      return;
    }

    try {
      await walletService.deleteWallet(walletId);
      setWallets(prev => prev.filter(wallet => wallet.id !== walletId));
    } catch (err) {
      setError('Failed to delete wallet. Please try again.');
      console.error('Error deleting wallet:', err);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading wallets...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Wallets</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddWallet(true)}
        >
          Add New Wallet
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showAddWallet && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add New Wallet</h2>
            <AddWalletForm
              onSubmit={handleAddWallet}
              onCancel={() => setShowAddWallet(false)}
            />
          </div>
        </div>
      )}

      <div className={styles.walletGrid}>
        {wallets.map(wallet => (
          <div key={wallet.id} className={styles.walletCard}>
            <div className={styles.walletHeader}>
              <h3>{wallet.name}</h3>
              <div className={styles.walletActions}>
                <button
                  className={styles.editButton}
                  onClick={() => setSelectedWallet(wallet)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteWallet(wallet.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className={styles.walletDetails}>
              <p className={styles.balance}>
                Balance: ₹{parseFloat(wallet.balance).toFixed(2)}
              </p>
              <p className={styles.type}>Type: {wallet.type}</p>
              {wallet.accountNumber && (
                <p className={styles.accountNumber}>
                  Account: ****{wallet.accountNumber.slice(-4)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {wallets.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <p>No wallets found. Add your first wallet to get started!</p>
        </div>
      )}
    </div>
  );
};

export default WalletDashboard; 