import React from 'react';
import { render, screen } from '@testing-library/react';
import MonthlySpendingChart from './MonthlySpendingChart';

jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }) => <div data-testid="mock-responsive-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="mock-bar-chart">{children}</div>,
  Bar: () => <div data-testid="mock-bar" />,
  XAxis: () => <div data-testid="mock-x-axis" />,
  YAxis: () => <div data-testid="mock-y-axis" />,
  Tooltip: () => <div data-testid="mock-tooltip" />,
  Legend: () => <div data-testid="mock-legend" />,
}));

describe('MonthlySpendingChart', () => {
  it('should render empty state message when no data is provided', () => {
    render(<MonthlySpendingChart expenses={[]} />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('should render chart when data is provided', () => {
    const mockExpenses = [
      {
        id: 1,
        amount: 100,
        date: '2024-03-15',
        category: { id: 1, name: 'Food' },
      },
      {
        id: 2,
        amount: 200,
        date: '2024-03-16',
        category: { id: 2, name: 'Transport' },
      },
    ];

    render(<MonthlySpendingChart expenses={mockExpenses} />);

    expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
  });

  it('should render chart title', () => {
    render(<MonthlySpendingChart expenses={[]} />);
    expect(screen.getByText(/monthly spending/i)).toBeInTheDocument();
  });
}); 