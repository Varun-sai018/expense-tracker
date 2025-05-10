import { subDays, format } from 'date-fns'

const categories = ['Food', 'Transport', 'Rent', 'Entertainment']

// Generate random amount between min and max
const randomAmount = (min, max) => {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

// Generate random description based on category
const getDescription = (category) => {
  const descriptions = {
    Food: ['Groceries', 'Restaurant', 'Coffee', 'Lunch', 'Dinner', 'Snacks'],
    Transport: ['Gas', 'Bus fare', 'Train ticket', 'Taxi', 'Parking'],
    Rent: ['Monthly rent', 'Utilities', 'Internet', 'Maintenance'],
    Entertainment: ['Movie', 'Concert', 'Games', 'Books', 'Streaming']
  }
  return descriptions[category][Math.floor(Math.random() * descriptions[category].length)]
}

// Generate mock expenses
const generateMockExpenses = () => {
  const expenses = []
  const today = new Date()

  // Generate 20 expenses with random dates in the last 30 days
  for (let i = 0; i < 20; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30)
    const date = subDays(today, randomDaysAgo)
    const category = categories[Math.floor(Math.random() * categories.length)]
    
    // Different amount ranges for different categories
    let amount
    switch (category) {
      case 'Rent':
        amount = randomAmount(800, 2000)
        break
      case 'Food':
        amount = randomAmount(10, 100)
        break
      case 'Transport':
        amount = randomAmount(5, 50)
        break
      case 'Entertainment':
        amount = randomAmount(20, 200)
        break
      default:
        amount = randomAmount(10, 100)
    }

    expenses.push({
      id: Date.now() + i,
      amount,
      category,
      date: format(date, 'yyyy-MM-dd'),
      description: getDescription(category)
    })
  }

  return expenses
}

// Store mock data
let mockExpenses = generateMockExpenses()

// Export functions
export const getExpenses = () => {
  return [...mockExpenses]
}

export const addExpense = (expense) => {
  const newExpense = {
    ...expense,
    id: Date.now(),
    amount: Number(expense.amount)
  }
  console.log('Adding new expense:', newExpense)
  mockExpenses = [...mockExpenses, newExpense]
  return newExpense
} 