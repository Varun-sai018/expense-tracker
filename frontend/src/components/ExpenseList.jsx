import { useState, useMemo } from 'react'
import { format } from 'date-fns'

function ExpenseList({ expenses = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = useMemo(() => {
    const uniqueCategories = new Set(expenses.map(expense => expense.category))
    return ['all', ...Array.from(uniqueCategories)]
  }, [expenses])

  const sortedAndFilteredExpenses = useMemo(() => {
    let result = [...expenses]

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(expense => expense.category === categoryFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      } else if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount
      }
      return 0
    })

    return result
  }, [expenses, sortConfig, categoryFilter])

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="categoryFilter">Filter by Category: </label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '8px' }}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginTop: '20px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th 
              style={{ 
                padding: '12px', 
                textAlign: 'left',
                cursor: 'pointer'
              }}
              onClick={() => requestSort('date')}
            >
              Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              style={{ 
                padding: '12px', 
                textAlign: 'right',
                cursor: 'pointer'
              }}
              onClick={() => requestSort('amount')}
            >
              Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredExpenses.map((expense, index) => (
            <tr 
              key={index}
              style={{ 
                borderBottom: '1px solid #ddd',
                backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
              }}
            >
              <td style={{ padding: '12px' }}>
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </td>
              <td style={{ padding: '12px', textAlign: 'right' }}>
                ${expense.amount.toFixed(2)}
              </td>
              <td style={{ padding: '12px' }}>{expense.category}</td>
              <td style={{ padding: '12px' }}>{expense.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseList 