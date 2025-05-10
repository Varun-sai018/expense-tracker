import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import AddWalletForm from '../components/AddWalletForm';
import PaymentHistory from '../components/PaymentHistory';
import styles from './DashboardPage.module.css';
import { BANK_ICONS, CARD_ICONS, UPI_ICONS, DEFAULT_ICONS } from '../assets/icons';

function exportTransactionsToCSV(transactions) {
  if (!transactions || transactions.length === 0) return;
  const headers = Object.keys(transactions[0]);
  const csvRows = [headers.join(',')];
  transactions.forEach(tx => {
    const row = headers.map(h => `"${(tx[h] ?? '').toString().replace(/"/g, '""')}"`).join(',');
    csvRows.push(row);
  });
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const DashboardPage = ({ transactions, wallets, onAddWallet, budget, setBudget, onLogout }) => {
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  // Function to get wallet icon based on type and provider
  const getWalletIcon = (wallet) => {
    if (wallet.type === 'bank') {
      return BANK_ICONS[wallet.provider?.toLowerCase()] || DEFAULT_ICONS.bank;
    } else if (wallet.type === 'card') {
      return CARD_ICONS[wallet.provider?.toLowerCase()] || DEFAULT_ICONS.card;
    } else if (wallet.type === 'upi') {
      return UPI_ICONS[wallet.provider?.toLowerCase()] || DEFAULT_ICONS.upi;
    }
    return DEFAULT_ICONS.default;
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= monthStart);
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const monthlyIncome = monthlyTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0);
    const pendingPayments = transactions.filter(t => t.status === 'pending').length;

    return [
      { 
        label: 'Total Balance',
        value: totalBalance,
        trend: 'up',
        color: 'blue',
        icon: '💰'
      },
      { 
        label: 'Monthly Expenses',
        value: monthlyExpenses,
        trend: 'down',
        color: 'red',
        icon: '📉'
      },
      { 
        label: 'Monthly Income',
        value: monthlyIncome,
        trend: 'up',
        color: 'green',
        icon: '📈'
      },
      { 
        label: 'Pending Payments',
        value: pendingPayments,
        trend: 'neutral',
        color: 'yellow',
        icon: '⏳'
      }
    ];
  }, [transactions, wallets]);

  // Prepare chart data
  const chartData = React.useMemo(() => {
    const data = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), i);
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === i && tDate.getMonth() === now.getMonth();
      });
      
      data.push({
        date: i,
        expenses: dayTransactions
          .filter(t => t.amount < 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        income: dayTransactions
          .filter(t => t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0)
      });
    }
    return data;
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total expenses for the current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyExpenses = transactions
    .filter(t => t.amount < 0 && new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const budgetUsed = Math.min((monthlyExpenses / budget) * 100, 100);
  const overBudget = monthlyExpenses > budget;

  return (
    <div className={styles.dashboard}>
      {/* Budget Section & Export Button */}
      <div style={{
        background: '#f8fafc',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{margin: 0, fontSize: '1.3rem'}}>Monthly Budget</h2>
          <button
            onClick={() => exportTransactionsToCSV(transactions)}
            style={{background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer'}}
          >
            Export to CSV
          </button>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0'}}>
          <span style={{fontWeight: 500}}>Set Budget (₹):</span>
          <input
            type="number"
            min={0}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            style={{padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', width: 120}}
          />
        </div>
        <div style={{margin: '12px 0'}}>
          <div style={{height: 18, background: '#e5e7eb', borderRadius: 9, overflow: 'hidden'}}>
            <div style={{
              width: `${budgetUsed}%`,
              height: '100%',
              background: overBudget ? '#ef4444' : '#3b82f6',
              transition: 'width 0.4s',
              borderRadius: 9
            }} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 4}}>
            <span>Spent: ₹{monthlyExpenses.toLocaleString()}</span>
            <span>Budget: ₹{budget.toLocaleString()}</span>
          </div>
        </div>
        {overBudget && (
          <div style={{color: '#ef4444', fontWeight: 500, marginTop: 8}}>
            ⚠️ You have exceeded your monthly budget!
          </div>
        )}
      </div>
      {/* Header */}
      <motion.header 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1>Dashboard</h1>
            <p className={styles.dateTime}>
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className={styles.headerActions}>
            <motion.button 
              className={`${styles.addButton} ${styles.primary}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWalletForm(!showWalletForm)}
            >
              {showWalletForm ? '✕ Close' : '+ Add Wallet/Account'}
            </motion.button>
            <motion.button 
              className={`${styles.addButton} ${styles.success}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/add-expense')}
            >
              + Add Expense
            </motion.button>
            <motion.button 
              className={`${styles.addButton} ${styles.info}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/add-income')}
            >
              + Add Income
            </motion.button>
            <motion.button 
              className={`${styles.addButton} ${styles.warning}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/spending-analysis')}
            >
              📊 Analysis
            </motion.button>
            <motion.button 
              className={`${styles.addButton} ${styles.secondary}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
            >
              👤 Profile
            </motion.button>
            <motion.button 
              className={styles.addButton}
              style={{ background: '#ef4444', color: '#fff', marginLeft: 12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className={styles.main}>
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className={`${styles.statCard} ${styles[stat.color]}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>{stat.icon}</span>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={`${styles.trendIndicator} ${styles[stat.trend]}`}>
                  {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '•'}
                </span>
              </div>
              <div className={styles.statValue}>
                {typeof stat.value === 'number' && stat.label !== 'Pending Payments' 
                  ? formatCurrency(stat.value)
                  : stat.value
                }
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className={styles.chartsSection}>
          <motion.div 
            className={styles.chartCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3>Monthly Cash Flow</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stackId="1" 
                  stroke="#4CAF50" 
                  fill="#4CAF50" 
                  name="Income"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stackId="1" 
                  stroke="#FF5252" 
                  fill="#FF5252" 
                  name="Expenses"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Wallet Form */}
        {showWalletForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AddWalletForm
              onSubmit={onAddWallet}
              onCancel={() => setShowWalletForm(false)}
            />
          </motion.div>
        )}

        {/* Wallets Section */}
        <motion.div 
          className={styles.walletsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2>Linked Wallets/Accounts</h2>
          {wallets.length === 0 ? (
            <div className={styles.emptyState}>
              <img 
                src="/empty-wallet.svg" 
                alt="No wallets" 
                className={styles.emptyStateImage}
              />
              <p>No wallets or accounts added yet.</p>
              <motion.button 
                className={styles.addButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWalletForm(true)}
              >
                + Add Your First Wallet/Account
              </motion.button>
            </div>
          ) : (
            <div className={styles.walletsGrid}>
              {wallets.map((wallet, index) => (
                <motion.div 
                  key={wallet.id} 
                  className={styles.walletCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={styles.walletHeader}>
                    {(() => {
                      const icon = getWalletIcon(wallet);
                      if (typeof icon === 'string' && icon.startsWith('http')) {
                        return <img src={icon} alt={`${wallet.name} icon`} className={styles.walletIcon} />;
                      } else {
                        return <span className={styles.walletIcon} style={{fontSize: '2rem'}}>{icon}</span>;
                      }
                    })()}
                    <h3>{wallet.name}</h3>
                  </div>
                  <div className={styles.walletDetails}>
                    {wallet.type === 'bank' && (
                      <>
                        <p>{wallet.bankName}</p>
                        <p>Account: •••• {wallet.accountNumber.slice(-4)}</p>
                        <p>IFSC: {wallet.ifscCode}</p>
                      </>
                    )}
                    {wallet.type === 'card' && (
                      <>
                        <p>Card: •••• {wallet.cardNumber.slice(-4)}</p>
                        <p>Expires: {wallet.expiryDate}</p>
                      </>
                    )}
                    {wallet.type === 'upi' && (
                      <p>UPI ID: {wallet.upiId}</p>
                    )}
                    <p className={styles.balance}>
                      Balance: {formatCurrency(parseFloat(wallet.balance))}
                    </p>
                  </div>
                  <div className={styles.walletActions}>
                    <motion.button 
                      className={`${styles.actionButton} ${styles.primary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button 
                      className={`${styles.actionButton} ${styles.danger}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <PaymentHistory transactions={transactions} />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage; 