import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import "./login.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, {
        email: resetEmail
      });
      setResetToken(response.data.resetToken); // Add this line to use setResetToken
      setShowResetForm(true);
      toast.success('Please set your new password');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred');
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/auth/reset-password`, {
        resetToken,
        newPassword
      });
      toast.success('Password updated successfully');
      setShowResetForm(false);
      setIsForgotPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred');
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${apiUrl}/api/auth/google`, {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Additional signup validations
    if (!isLogin) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (password.length > 0 && !/\d/.test(password)) {
        newErrors.password = "Password must contain at least one number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post(`${apiUrl}/api/auth/login`, {
          email,
          password
        });
        localStorage.setItem("token", res.data.token);
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        const res = await axios.post(`${apiUrl}/api/auth/signup`, {
          email,
          password
        });
        localStorage.setItem("token", res.data.token);
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || `${isLogin ? "Login" : "Signup"} failed`);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="login-box">
        {!isForgotPassword && !showResetForm ? (
          <>
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="subtitle">
              {isLogin ? "Please enter your details" : "Please fill in your information"}
            </p>
            
            <form onSubmit={handleSubmit}>
              {/* {!isLogin && (
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )} */}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: "" });
                    }}
                    required
                  />
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword}</span>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="form-options">
                  <label>
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <button 
                    type="button" 
                    className="forgot-password-btn"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="login-button">
                {isLogin ? "Sign in" : "Sign up"}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="google-login">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                cookiePolicy={'single_host_origin'}
                buttonText={isLogin ? "Sign in with Google" : "Sign up with Google"}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <p className="signup-link">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                className="link-button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </>
        ) : isForgotPassword && !showResetForm ? (
          <div className="forgot-password-form">
            <h2>Reset Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Verify Email</button>
              <button 
                type="button"
                className="back-button"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </button>
            </form>
          </div>
        ) : (
          <div className="reset-password-form">
            <h2>Set New Password</h2>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Update Password</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
