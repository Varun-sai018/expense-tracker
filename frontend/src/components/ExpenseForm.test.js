import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseForm from './ExpenseForm';

describe('ExpenseForm', () => {
  const mockOnSubmit = jest.fn();
  const mockCategories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
  ];

  beforeEach(() => {
    render(<ExpenseForm onSubmit={mockOnSubmit} categories={mockCategories} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show validation errors when submitting empty form', async () => {
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/amount is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/category is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid amount', async () => {
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '-10' } });

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/amount must be greater than 0/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const amountInput = screen.getByLabelText(/amount/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const submitButton = screen.getByRole('button', { name: /add expense/i });

    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test expense' } });
    fireEvent.change(categorySelect, { target: { value: '1' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      amount: 100,
      description: 'Test expense',
      categoryId: 1,
      date: expect.any(String),
    });
  });
}); 