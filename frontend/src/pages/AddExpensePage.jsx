import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CategorySelector from '../components/ExpenseForm/CategorySelector'
import RecurringExpenseSection from '../components/ExpenseForm/RecurringExpenseSection'
import FormSection from '../components/ExpenseForm/FormSection'
import AmountInput from '../components/ExpenseForm/AmountInput'
import styles from './AddExpensePage.module.css'

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
]

const AddExpensePage = ({ onSubmit, wallets = [] }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    walletId: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
    recurringDay: '1',
    notes: '',
    attachments: []
  })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setFormData(prev => ({
      ...prev,
      category: category.id
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.category || !formData.walletId) {
      setToast({
        type: 'error',
        message: 'Please fill in all required fields'
      })
      return
    }

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      type: 'expense'
    }

    onSubmit(expenseData)
    setToast({
      type: 'success',
      message: 'Expense added successfully!'
    })

    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Add New Expense
          </motion.h1>
          <p className={styles.subtitle}>Track your spending by adding expense details below</p>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div 
              className={`${styles.toast} ${styles[toast.type]}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormSection title="Basic Details">
            <AmountInput 
              value={formData.amount}
              onChange={handleChange}
            />

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Select Wallet/Account</label>
                <select
                  name="walletId"
                  value={formData.walletId}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Choose wallet/account</option>
                  {wallets.map(wallet => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} - Balance: ₹{parseFloat(wallet.balance).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What did you spend on?"
                className={styles.input}
              />
            </div>
          </FormSection>

          <FormSection title="Category">
            <CategorySelector 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </FormSection>

          <FormSection title="Recurring Options">
            <RecurringExpenseSection 
              formData={formData}
              onChange={handleChange}
            />
          </FormSection>

          <FormSection title="Additional Details">
            <div className={styles.formGroup}>
              <label>Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Attachments (Optional)</label>
              <div className={styles.fileInput}>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className={styles.fileInputField}
                />
                <p className={styles.fileHelp}>
                  Upload receipts or related documents (Images, PDFs)
                </p>
              </div>
            </div>
          </FormSection>

          <div className={styles.actions}>
            <motion.button
              type="button"
              onClick={() => navigate('/dashboard')}
              className={`${styles.button} ${styles.secondary}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className={`${styles.button} ${styles.primary}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Expense
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpensePage 