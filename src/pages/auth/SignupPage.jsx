import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import AuthForm from './AuthForm';
import './authStyles.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Register user with backend
      const response = await userService.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone
      });
      
      // If registration is successful, navigate to login
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand-header">
          <div className="logo-container">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3321/3321752.png"
              alt="ExpenseTrack Logo" 
              className="brand-logo"
            />
          </div>
          <h1 className="brand-name">ExpenseTrack Pro</h1>
          <p className="brand-tagline">Smart Expense Management for Modern Businesses</p>
        </div>

        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Sign up to get started with your expense tracking</p>
        </div>

        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          error={error}
          isLoading={isLoading}
        />

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 