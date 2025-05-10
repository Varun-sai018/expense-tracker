import { useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

function CategoryPieChart({ expenses }) {
  const chartData = useMemo(() => {
    // Calculate total spending per category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    // Calculate total spending
    const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

    // Calculate percentages
    const categoryPercentages = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      percentage: (amount / totalSpending) * 100
    }))

    return {
      labels: categoryPercentages.map(item => `${item.category} (${item.percentage.toFixed(1)}%)`),
      datasets: [
        {
          data: categoryPercentages.map(item => item.percentage),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
          borderWidth: 1
        }
      ]
    }
  }, [expenses])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Spending by Category'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(1)}%`
          }
        }
      }
    }
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default CategoryPieChart 