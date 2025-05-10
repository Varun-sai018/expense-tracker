function BudgetProgress({ budget = 1000, spent = 0 }) {
  const percentage = Math.min((spent / budget) * 100, 100)
  const remaining = budget - spent

  return (
    <div style={{ 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3 style={{ marginBottom: '15px' }}>Budget Progress</h3>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <span>Spent: ${spent.toFixed(2)}</span>
        <span>Budget: ${budget.toFixed(2)}</span>
      </div>

      <div style={{ 
        width: '100%',
        height: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: percentage > 80 ? '#dc3545' : percentage > 50 ? '#ffc107' : '#28a745',
            transition: 'width 0.3s ease-in-out'
          }}
        />
      </div>

      <div style={{ 
        marginTop: '10px',
        textAlign: 'right',
        color: remaining < 0 ? '#dc3545' : '#28a745'
      }}>
        {remaining >= 0 
          ? `Remaining: $${remaining.toFixed(2)}`
          : `Over budget by: $${Math.abs(remaining).toFixed(2)}`
        }
      </div>
    </div>
  )
}

export default BudgetProgress 