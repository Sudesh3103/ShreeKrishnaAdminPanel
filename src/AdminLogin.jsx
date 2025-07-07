import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;

      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({
        general: error.response?.data?.message || "Login failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="rgba(255,255,255,0.1)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="300" cy="700" r="120" fill="url(%23a)"/><circle cx="900" cy="800" r="80" fill="url(%23a)"/></svg>');
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .login-card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          transform: ${mounted ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)'};
          opacity: ${mounted ? 1 : 0};
          transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .logo-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto;
          position: relative;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
          100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
        }

        .form-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .form-control-modern {
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          padding: 16px 20px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .form-control-modern:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 20px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
        }

        .input-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .form-control-modern:focus + .input-icon,
        .form-control-modern:not(:placeholder-shown) + .input-icon {
          color: #667eea;
          transform: translateY(-50%) scale(1.1);
        }

        .btn-modern {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 16px;
          font-weight: 600;
          font-size: 16px;
          color: white;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn-modern:hover::before {
          left: 100%;
        }

        .btn-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-modern:active {
          transform: translateY(0);
        }

        .password-toggle {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .password-toggle:hover {
          color: #667eea;
          transform: translateY(-50%) scale(1.1);
        }

        .floating-label {
          position: absolute;
          left: 60px;
          top: 18px;
          font-size: 16px;
          color: #6c757d;
          pointer-events: none;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          padding: 0 8px;
        }

        .form-control-modern:focus ~ .floating-label,
        .form-control-modern:not(:placeholder-shown) ~ .floating-label {
          top: -8px;
          font-size: 12px;
          color: #667eea;
          font-weight: 500;
        }

        .demo-box {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .demo-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #667eea, transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .error-alert {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
          color: white;
          border: none;
          border-radius: 12px;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .spinner-modern {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .footer-text {
          color: rgba(255, 255, 255, 0.8);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .checkbox-modern {
          width: 20px;
          height: 20px;
          accent-color: #667eea;
        }

        .link-modern {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }

        .link-modern::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #667eea;
          transition: width 0.3s ease;
        }

        .link-modern:hover::after {
          width: 100%;
        }

        .link-modern:hover {
          color: #764ba2;
        }
      `}</style>

      <div className="login-container d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6 mt-4">
              <div className="login-card p-2 p-md-5 rounded-4">
                {/* Logo Section */}
                <div className="text-center mb-5">
                  <div className="logo-container mb-4">
                    <i className="bi bi-shield-lock" style={{fontSize: '32px', color: 'white'}}></i>
                  </div>
                  <h1 className="fw-bold mb-2" style={{color: '#2d3748', fontSize: '2rem'}}>
                    Welcome Back
                  </h1>
                  <p className="text-muted mb-0" style={{fontSize: '1.1rem'}}>
                    Sign in to your admin dashboard
                  </p>
                </div>

                {/* Error Alert */}
                {errors.general && (
                  <div className="error-alert alert d-flex align-items-center mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-3"></i>
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Login Form */}
                <div>
                  {/* Email Field */}
                  <div className="form-group">
                    <input
                      type="email"
                      className={`form-control-modern w-100 ${errors.email ? 'border-danger' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder=" "
                      disabled={isLoading}
                      style={{paddingLeft: '60px'}}
                    />
                    <i className="input-icon bi bi-envelope"></i>
                    <label className="floating-label">Email Address</label>
                    {errors.email && (
                      <div className="text-danger mt-2 small fw-medium">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="form-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control-modern w-100 ${errors.password ? 'border-danger' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder=" "
                      disabled={isLoading}
                      style={{paddingLeft: '60px', paddingRight: '60px'}}
                    />
                    <i className="input-icon bi bi-lock"></i>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    <label className="floating-label">Password</label>
                    {errors.password && (
                      <div className="text-danger mt-2 small fw-medium">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.password}
                      </div>
                    )}
                  </div>

                 

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">

                    <div className="d-flex align-items-center">
                      <input 
                        type="checkbox" 
                        className="checkbox-modern me-2"
                        id="rememberMe"
                        disabled={isLoading}
                      />
                      <label htmlFor="rememberMe" className="text-muted small mb-0">
                        Remember me
                      </label>
                    </div>

                      {/* Forgot Password Link */}
                      <div className="mb-3 text-end">
                        <button type="button" className="btn btn-link p-0 " style={{color: '#667eea', textDecoration: 'underline'}} onClick={() => navigate('/forgot-password')}>
                          Forgot Password?
                        </button>
                      </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    className="btn-modern w-100 mb-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-modern me-3"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="bi bi-arrow-right-circle me-2"></i>
                        <span>Sign In to Dashboard</span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Demo Credentials */}
                <div className="demo-box">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-info-circle me-2" style={{color: '#667eea'}}></i>
                    <span className="fw-semibold" style={{color: '#667eea'}}>Demo Credentials</span>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-2">
                      <small className="text-muted d-block">Email:</small>
                      <code className="text-dark">sudeshkalokhe3103@gmail.com</code>
                    </div>
                    <div className="col-12">
                      <small className="text-muted d-block">Password:</small>
                      <code className="text-dark">sk@123</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="footer-text small mb-0">
                  © 2025 E-Commerce Admin Portal. Crafted with ❤️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap CSS & Icons */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
        rel="stylesheet" 
      />
    </>
  );
};

export default AdminLogin;