import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseList from './ExpenseList';

describe('ExpenseList', () => {
  const mockExpenses = [
    {
      id: 1,
      amount: 100,
      description: 'Lunch',
      category: { id: 1, name: 'Food' },
      date: '2024-03-15',
    },
    {
      id: 2,
      amount: 50,
      description: 'Bus ticket',
      category: { id: 2, name: 'Transport' },
      date: '2024-03-14',
    },
    {
      id: 3,
      amount: 200,
      description: 'Dinner',
      category: { id: 1, name: 'Food' },
      date: '2024-03-13',
    },
  ];

  const mockCategories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
  ];

  beforeEach(() => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        categories={mockCategories}
        onDelete={jest.fn()}
      />
    );
  });

  it('should sort expenses by amount in ascending order', () => {
    const sortSelect = screen.getByLabelText(/sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'amount-asc' } });

    const expenseAmounts = screen.getAllByTestId('expense-amount');
    expect(expenseAmounts[0]).toHaveTextContent('50');
    expect(expenseAmounts[1]).toHaveTextContent('100');
    expect(expenseAmounts[2]).toHaveTextContent('200');
  });

  it('should sort expenses by date in descending order', () => {
    const sortSelect = screen.getByLabelText(/sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'date-desc' } });

    const expenseDates = screen.getAllByTestId('expense-date');
    expect(expenseDates[0]).toHaveTextContent('2024-03-15');
    expect(expenseDates[1]).toHaveTextContent('2024-03-14');
    expect(expenseDates[2]).toHaveTextContent('2024-03-13');
  });

  it('should filter expenses by category', () => {
    const filterSelect = screen.getByLabelText(/filter by category/i);
    fireEvent.change(filterSelect, { target: { value: '1' } });

    const expenseItems = screen.getAllByTestId('expense-item');
    expect(expenseItems).toHaveLength(2);
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.queryByText('Bus ticket')).not.toBeInTheDocument();
  });

  it('should show all expenses when no filter is selected', () => {
    const filterSelect = screen.getByLabelText(/filter by category/i);
    fireEvent.change(filterSelect, { target: { value: '' } });

    const expenseItems = screen.getAllByTestId('expense-item');
    expect(expenseItems).toHaveLength(3);
  });
}); 