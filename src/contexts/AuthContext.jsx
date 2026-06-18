// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '@services/api';
import { validateMobile, validateEmail, validatePassword, validateOTP } from '@utils/validators';

export const AuthContext = createContext();

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const inactivityTimerRef = useRef(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('ra_token');
    const storedUser = localStorage.getItem('ra_user');
    const lastActivity = parseInt(localStorage.getItem('ra_last_activity') || '0', 10);

    if (storedToken && storedUser) {
      // If the stored session has been inactive longer than the limit
      // (e.g. laptop was closed/off for 30+ min), force logout instead of restoring it.
      const inactiveFor = Date.now() - lastActivity;
      if (lastActivity && inactiveFor > INACTIVITY_LIMIT_MS) {
        localStorage.removeItem('ra_token');
        localStorage.removeItem('ra_user');
        localStorage.removeItem('ra_last_activity');
        setIsLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        localStorage.setItem('ra_last_activity', String(Date.now()));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('ra_token');
        localStorage.removeItem('ra_user');
        localStorage.removeItem('ra_last_activity');
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
      localStorage.setItem('ra_last_activity', String(Date.now()));
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
    localStorage.removeItem('ra_last_activity');
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  // ── Auto-logout after 30 minutes of inactivity ──────────────────────────
  useEffect(() => {
    if (!token) return; // only track activity while logged in

    const resetTimer = () => {
      localStorage.setItem('ra_last_activity', String(Date.now()));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        logout();
      }, INACTIVITY_LIMIT_MS);
    };

    // Start the timer immediately on login / page load while logged in
    resetTimer();

    ACTIVITY_EVENTS.forEach(evt => window.addEventListener(evt, resetTimer));

    return () => {
      ACTIVITY_EVENTS.forEach(evt => window.removeEventListener(evt, resetTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [token, logout]);

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