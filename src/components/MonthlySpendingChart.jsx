import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from 'date-fns'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function MonthlySpendingChart({ expenses }) {
  const chartData = useMemo(() => {
    const today = new Date()
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    
    // Get all days in the current month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    // Calculate daily totals
    const dailyTotals = daysInMonth.reduce((acc, day) => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const dayTotal = expenses
        .filter(expense => expense.date === dateStr)
        .reduce((sum, expense) => sum + expense.amount, 0)
      
      acc[dateStr] = dayTotal
      return acc
    }, {})

    return {
      labels: daysInMonth.map(day => format(day, 'MMM dd')),
      datasets: [
        {
          label: 'Daily Spending',
          data: daysInMonth.map(day => dailyTotals[format(day, 'yyyy-MM-dd')] || 0),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    }
  }, [expenses])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Spending This Month'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        }
      }
    }
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default MonthlySpendingChart 