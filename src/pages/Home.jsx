import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Add Expense', path: '/add-expense', icon: '💰' },
    { title: 'Add Income', path: '/add-income', icon: '💵' },
    { title: 'Dashboard', path: '/dashboard', icon: '📊' },
    { title: 'Analysis', path: '/spending-analysis', icon: '📈' },
  ];

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>FinTrack</h1>
        <p className={styles.subtitle}>Personal Finance Manager</p>

        <div className={styles.menuGrid}>
          {menuItems.map((item) => (
            <motion.button
              key={item.path}
              className={styles.menuItem}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuTitle}>{item.title}</span>
            </motion.button>
          ))}
        </div>

        <div className={styles.authButtons}>
          <motion.button
            className={`${styles.button} ${styles.loginButton}`}
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>
          <motion.button
            className={`${styles.button} ${styles.signupButton}`}
            onClick={() => navigate('/signup')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home; 