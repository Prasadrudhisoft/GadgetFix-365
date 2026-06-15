// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@services/api';
import { validateMobile, validateEmail, validatePassword, validateOTP } from '@utils/validators';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('ra_token');
    const storedUser = localStorage.getItem('ra_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('ra_token');
        localStorage.removeItem('ra_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (mobile, password) => {
    // Validate inputs
    const mobileValidation = validateMobile(mobile);
    if (!mobileValidation.valid) {
      throw new Error(mobileValidation.message);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // API call
    const data = await authAPI.login(mobile, password);

    if (data.status === 'success') {
      setToken(data.token);
      setUser(data.user_data);
      localStorage.setItem('ra_token', data.token);
      localStorage.setItem('ra_user', JSON.stringify(data.user_data));
      return data;
    } else {
      throw new Error(data.message || 'Login failed. Please try again.');
    }
  }, []);

  const register = useCallback(async (name, mobile, email, password) => {
    // Validate inputs
    if (!name.trim()) {
      throw new Error('👤 Full name is required');
    }

    const mobileValidation = validateMobile(mobile);
    if (!mobileValidation.valid) {
      throw new Error(mobileValidation.message);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.message);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // API call
    const data = await authAPI.register({
      name,
      mobile_no: mobile,
      email,
      password,
    });

    if (data.status === 'success') {
      return data;
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  }, []);

  const verifyRegisterOTP = useCallback(async (mobile, otp) => {
    const otpValidation = validateOTP(otp);
    if (!otpValidation.valid) {
      throw new Error(otpValidation.message);
    }

    const data = await authAPI.verifyRegister(mobile, otp);

    if (data.status === 'success') {
      return data;
    } else {
      throw new Error(data.message || 'Invalid OTP. Please try again.');
    }
  }, []);

  const forgotPasswordRequest = useCallback(async (mobile, newPassword) => {
    const mobileValidation = validateMobile(mobile);
    if (!mobileValidation.valid) {
      throw new Error(mobileValidation.message);
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    const data = await authAPI.forgotPasswordRequest(mobile, newPassword);

    if (data.status === 'success') {
      return data;
    } else {
      throw new Error(data.message || 'Failed to send OTP');
    }
  }, []);

  const forgotPasswordVerify = useCallback(async (mobile, otp) => {
    const otpValidation = validateOTP(otp);
    if (!otpValidation.valid) {
      throw new Error(otpValidation.message);
    }

    const data = await authAPI.forgotPasswordVerify(mobile, otp);

    if (data.status === 'success') {
      return data;
    } else {
      throw new Error(data.message || 'OTP verification failed');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ra_token');
    localStorage.removeItem('ra_user');
  }, []);

  const value = {
    user,
    token,
    isLoggedIn: !!token,
    isLoading,
    login,
    register,
    verifyRegisterOTP,
    forgotPasswordRequest,
    forgotPasswordVerify,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};