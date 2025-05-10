import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PaymentOptions from './components/PaymentOptions';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AddExpensePage from './pages/AddExpensePage';
import AddIncomePage from './pages/AddIncomePage';
import SpendingAnalysisPage from './pages/SpendingAnalysisPage';
import WalletDashboard from './pages/WalletDashboard';
import TransactionDashboard from './pages/TransactionDashboard';
import styles from './App.module.css';
import './pages/auth/authStyles.css';
import { walletService } from './services/walletService';
import { transactionService } from './services/transactionService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState(20000); // Default monthly budget
  const [goal, setGoal] = useState(10000); // Default monthly savings goal
  
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isAuthenticated) {
        try {
          const [walletsData, transactionsData] = await Promise.all([
            walletService.getWallets(),
            transactionService.getTransactions()
          ]);
          setWallets(walletsData);
          setTransactions(transactionsData);
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      }
    };

    fetchInitialData();
  }, [isAuthenticated]);

  const handlePaymentComplete = (paymentData) => {
    const newTransaction = {
      id: Date.now(),
      ...paymentData,
      date: new Date().toISOString(),
      type: 'payment',
      paymentDetails: {
        type: paymentData.paymentMethod,
        ...(paymentData.paymentMethod === 'card' && { last4: paymentData.cardNumber.slice(-4) }),
        ...(paymentData.paymentMethod === 'upi' && { upiId: paymentData.upiId }),
        ...(paymentData.paymentMethod === 'bank' && { last4: paymentData.accountNumber.slice(-4) })
      }
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleAddExpense = (expenseData) => {
    console.log('New Expense:', expenseData);
    // Here you would typically handle the expense data (e.g., save to backend)
  };

  const handleAddIncome = (incomeData) => {
    const newTransaction = {
      id: Date.now(),
      ...incomeData,
      date: new Date().toISOString(),
      type: 'income',
      amount: Math.abs(incomeData.amount)
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleAddWallet = (walletData) => {
    const newWallet = {
      id: Date.now(),
      ...walletData,
      lastUsed: new Date().toISOString(),
      balance: '0.00'
    };
    setWallets(prev => [...prev, newWallet]);
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="brand-header">
            <div className="logo-container">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3321/3321752.png"
                alt="ExpenseTrack Logo" 
                className="brand-logo"
              />
            </div>
            <h1 className="brand-name">ExpenseTrack Pro</h1>
          </div>
          <div className="auth-header">
            <h2 className="auth-title">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="auth-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <SignupPage />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <DashboardPage 
                  transactions={transactions}
                  wallets={wallets}
                  onAddExpense={handleAddExpense}
                  onAddIncome={handleAddIncome}
                  onAddWallet={handleAddWallet}
                  onLogout={handleLogout}
                  budget={budget}
                  setBudget={setBudget}
                  goal={goal}
                  setGoal={setGoal}
                />
              ) : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/wallets" 
            element={
              isAuthenticated ? <WalletDashboard /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/transactions" 
            element={
              isAuthenticated ? <TransactionDashboard /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/add-expense" 
            element={
              isAuthenticated ? (
                <AddExpensePage 
                  onSubmit={handleAddExpense}
                  wallets={wallets}
                />
              ) : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/add-income" 
            element={
              isAuthenticated ? (
                <AddIncomePage 
                  onSubmit={handleAddIncome}
                />
              ) : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/spending-analysis" 
            element={
              isAuthenticated ? (
                <SpendingAnalysisPage 
                  transactions={transactions}
                  wallets={wallets}
                />
              ) : <Navigate to="/login" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
