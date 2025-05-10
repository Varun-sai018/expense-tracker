import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ExpenseList from '../components/ExpenseList'
import { getExpenses } from '../utils/mockExpenses'

function ExpensesPage() {
  const expenses = getExpenses()

  return (
    <div style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          margin: 0,
          color: '#333'
        }}>
          Expenses
        </h1>
        <Link 
          to="/add-expense"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span> Add Expense
        </Link>
      </div>

      <ExpenseList expenses={expenses} />
    </div>
  )
}

export default ExpensesPage 