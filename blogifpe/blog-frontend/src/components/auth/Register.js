import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setSuccess('Account created successfully! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      if (typeof result.error === 'object') {
        const errorMessages = Object.values(result.error).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(result.error);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h1 className="register-title">Register</h1>

          {error.general && <div className="alert alert-error">{error.general}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="register-field">
            <label className="form-label">Username *</label>
            <input
              type="text"
              name="username"
              className={`form-input ${error.username ? 'error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
              required
            />
            {error.username && (
              <div className="text-sm text-error mt-1">
                {Array.isArray(error.username) ? error.username[0] : error.username}
              </div>
            )}
          </div>

          <div className="register-field">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className={`form-input ${error.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            {error.email && (
              <div className="text-sm text-error mt-1">
                {Array.isArray(error.email) ? error.email[0] : error.email}
              </div>
            )}
          </div>

          <div className="register-field">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password1"
              className={`form-input ${error.password1 ? 'error' : ''}`}
              value={formData.password1}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {error.password1 && (
              <div className="text-sm text-error mt-1">
                {Array.isArray(error.password1) ? error.password1[0] : error.password1}
              </div>
            )}
          </div>

          <div className="register-field">
            <label className="form-label">Confirm Password *</label>
            <input
              type="password"
              name="password2"
              className={`form-input ${error.password2 ? 'error' : ''}`}
              value={formData.password2}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {error.password2 && (
              <div className="text-sm text-error mt-1">
                {error.password2}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-fullwidth register-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>

          <div className="login-link-section">
            <RouterLink to="/login" className="auth-link">
              Already have an account? Sign In
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;