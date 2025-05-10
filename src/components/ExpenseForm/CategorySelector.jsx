import React from 'react';
import { motion } from 'framer-motion';
import styles from './CategorySelector.module.css';

const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', label: 'Transportation', icon: '🚗' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'bills', label: 'Bills & Utilities', icon: '📱' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'health', label: 'Healthcare', icon: '🏥' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'home', label: 'Home & Rent', icon: '🏠' },
  { id: 'other', label: 'Other', icon: '📝' }
];

const CategorySelector = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className={styles.categoriesSection}>
      <h3 className={styles.sectionTitle}>Select Category</h3>
      <div className={styles.categoryGrid}>
        {EXPENSE_CATEGORIES.map(category => (
          <motion.div
            key={category.id}
            className={`${styles.categoryCard} ${
              selectedCategory?.id === category.id ? styles.selected : ''
            }`}
            onClick={() => onCategorySelect(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.categoryIcon}>{category.icon}</span>
            <span className={styles.categoryLabel}>{category.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector; 