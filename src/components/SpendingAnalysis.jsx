import React, { useState, useEffect, useMemo } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import Select from 'react-select';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'area', label: 'Area Chart' }
];

const TIME_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'last3months', label: 'Last 3 Months' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'custom', label: 'Custom Range' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const SpendingAnalysis = ({ transactions, wallets }) => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [timeRange, setTimeRange] = useState(TIME_RANGES[2]); // Default to "This Month"
  const [chartType, setChartType] = useState(CHART_TYPES[0]); // Default to Bar Chart
  const [customDateRange, setCustomDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date()
  });

  // Convert wallets to options format for react-select
  const accountOptions = useMemo(() => {
    return wallets.map(wallet => ({
      value: wallet.id,
      label: wallet.name,
      type: wallet.type
    }));
  }, [wallets]);

  // Get date range based on selected time range
  const getDateRange = () => {
    const today = new Date();
    switch (timeRange.value) {
      case 'today':
        return { startDate: today, endDate: today };
      case 'week':
        return { startDate: subDays(today, 7), endDate: today };
      case 'month':
        return {
          startDate: startOfMonth(today),
          endDate: endOfMonth(today)
        };
      case 'last3months':
        return { startDate: subMonths(today, 3), endDate: today };
      case 'last6months':
        return { startDate: subMonths(today, 6), endDate: today };
      case 'custom':
        return customDateRange;
      default:
        return { startDate: subDays(today, 30), endDate: today };
    }
  };

  // Filter transactions based on selected accounts and date range
  const filteredData = useMemo(() => {
    const { startDate, endDate } = getDateRange();
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const isInDateRange = transactionDate >= startDate && transactionDate <= endDate;
      const isSelectedAccount = selectedAccounts.length === 0 || 
        selectedAccounts.some(account => account.value === transaction.accountId);
      return isInDateRange && isSelectedAccount;
    });
  }, [transactions, selectedAccounts, timeRange, customDateRange]);

  // Prepare data for charts
  const chartData = useMemo(() => {
    const data = {};
    
    filteredData.forEach(transaction => {
      const date = format(new Date(transaction.date), 'MMM d');
      if (!data[date]) {
        data[date] = {
          date,
          expenses: 0,
          income: 0
        };
      }
      
      if (transaction.amount < 0) {
        data[date].expenses += Math.abs(transaction.amount);
      } else {
        data[date].income += transaction.amount;
      }
    });

    return Object.values(data);
  }, [filteredData]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    return filteredData.reduce((acc, transaction) => {
      if (transaction.amount < 0) {
        acc.totalExpenses += Math.abs(transaction.amount);
      } else {
        acc.totalIncome += transaction.amount;
      }
      acc.totalTransactions += 1;
      return acc;
    }, {
      totalExpenses: 0,
      totalIncome: 0,
      totalTransactions: 0
    });
  }, [filteredData]);

  const renderChart = () => {
    switch (chartType.value) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
              <Bar dataKey="income" fill="#00C49F" name="Income" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" />
              <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = [
          { name: 'Expenses', value: summary.totalExpenses },
          { name: 'Income', value: summary.totalIncome }
        ];
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#FF8042" fill="#FF8042" name="Expenses" />
              <Area type="monotone" dataKey="income" stackId="1" stroke="#00C49F" fill="#00C49F" name="Income" />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      padding: 32,
      minHeight: 600,
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }}>
      <h2 style={{fontSize: '2rem', fontWeight: 700, marginBottom: 16}}>Spending Analysis</h2>
      {/* Controls Section */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        marginBottom: 24
      }}>
        <div style={{flex: 1, minWidth: 180}}>
          <label style={{fontWeight: 500, marginBottom: 6, display: 'block'}}>Select Accounts</label>
          <Select
            isMulti
            options={accountOptions}
            value={selectedAccounts}
            onChange={setSelectedAccounts}
            placeholder="All Accounts"
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        <div style={{flex: 1, minWidth: 180}}>
          <label style={{fontWeight: 500, marginBottom: 6, display: 'block'}}>Time Range</label>
          <Select
            options={TIME_RANGES}
            value={timeRange}
            onChange={setTimeRange}
            className="basic-select"
            classNamePrefix="select"
          />
        </div>
        <div style={{flex: 1, minWidth: 180}}>
          <label style={{fontWeight: 500, marginBottom: 6, display: 'block'}}>Chart Type</label>
          <Select
            options={CHART_TYPES}
            value={chartType}
            onChange={setChartType}
            className="basic-select"
            classNamePrefix="select"
          />
        </div>
      </div>
      {/* Custom Date Range */}
      {timeRange.value === 'custom' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={format(customDateRange.startDate, 'yyyy-MM-dd')}
              onChange={(e) => setCustomDateRange(prev => ({
                ...prev,
                startDate: new Date(e.target.value)
              }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={format(customDateRange.endDate, 'yyyy-MM-dd')}
              onChange={(e) => setCustomDateRange(prev => ({
                ...prev,
                endDate: new Date(e.target.value)
              }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      )}
      {/* Summary Cards */}
      <div style={{
        display: 'flex',
        gap: 24,
        marginBottom: 24,
        flexWrap: 'wrap'
      }}>
        <div style={{background: '#e0e7ff', borderRadius: 12, padding: 20, flex: 1, minWidth: 180}}>
          <h3 style={{color: '#3730a3', fontWeight: 600}}>Total Transactions</h3>
          <p style={{fontSize: 24, fontWeight: 700}}>{summary.totalTransactions}</p>
        </div>
        <div style={{background: '#bbf7d0', borderRadius: 12, padding: 20, flex: 1, minWidth: 180}}>
          <h3 style={{color: '#166534', fontWeight: 600}}>Total Income</h3>
          <p style={{fontSize: 24, fontWeight: 700}}>₹{summary.totalIncome.toFixed(2)}</p>
        </div>
        <div style={{background: '#fecaca', borderRadius: 12, padding: 20, flex: 1, minWidth: 180}}>
          <h3 style={{color: '#b91c1c', fontWeight: 600}}>Total Expenses</h3>
          <p style={{fontSize: 24, fontWeight: 700}}>₹{summary.totalExpenses.toFixed(2)}</p>
        </div>
      </div>
      {/* Chart */}
      <div style={{background: '#f3f4f6', borderRadius: 12, padding: 24, minHeight: 350}}>
        {renderChart()}
      </div>
      {/* Transaction List */}
      <div style={{marginTop: 24}}>
        <h3 style={{fontWeight: 600, marginBottom: 12}}>Recent Transactions</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {filteredData.slice(0, 5).map(transaction => (
            <div key={transaction.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', borderRadius: 8, padding: 16}}>
              <div>
                <p style={{fontWeight: 500, margin: 0}}>{transaction.description || 'Transaction'}</p>
                <p style={{fontSize: 13, color: '#6b7280', margin: 0}}>{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
              </div>
              <p style={{fontWeight: 600, color: transaction.amount < 0 ? '#dc2626' : '#16a34a', margin: 0}}>
                ₹{Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingAnalysis; 