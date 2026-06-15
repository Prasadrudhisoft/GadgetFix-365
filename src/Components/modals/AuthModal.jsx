// src/components/modals/AuthModal.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ add केला
import { Modal } from '@components/shared/Modal';
import { Button } from '@components/shared/Button';
import { Input } from '@components/shared/Input';
import { useAuth } from '@hooks/useAuth';
import { useUI } from '@hooks/useUI';
import clsx from 'clsx';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, register, verifyRegisterOTP, forgotPasswordRequest, forgotPasswordVerify } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate(); // ✅ add केला

  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register' | 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login Form
  const [loginData, setLoginData] = useState({ mobile: '', password: '' });

  // Register Form
  const [registerData, setRegisterData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
  });
  const [registerStep, setRegisterStep] = useState('main'); // 'main' | 'otp'
  const [otp, setOtp] = useState('');

  // Forgot Password Form
  const [forgotStep, setForgotStep] = useState('mobile'); // 'mobile' | 'otp'
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      resetForms();
    }
  }, [isOpen, initialTab]);

  const resetForms = () => {
    setLoginData({ mobile: '', password: '' });
    setRegisterData({ name: '', mobile: '', email: '', password: '' });
    setOtp('');
    setRegisterStep('main');
    setError('');
    setSuccess('');
    setShowPassword(false);
    // Forgot
    setForgotStep('mobile');
    setForgotMobile('');
    setForgotOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    setRegisterStep('main');
    setForgotStep('mobile');
  };

  // ── Login Handler ──────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login(loginData.mobile, loginData.password);
      showToast(`Welcome back, ${result.user_data.name}! 🎉`, 'success');
      onClose();

      // ✅ Admin असेल तर /admin वर redirect करा
      if (result.user_data?.role === 'admin') {
        navigate('/admin');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register Handler ───────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(
        registerData.name,
        registerData.mobile,
        registerData.email,
        registerData.password
      );
      setRegisterStep('otp');
      setSuccess('✅ Account created! Enter the OTP sent to your mobile.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP Verification Handler ───────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyRegisterOTP(registerData.mobile, otp);
      showToast('✅ Mobile verified! Please login to continue.', 'success');
      setActiveTab('login');
      resetForms();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setRegisterStep('main');
    setOtp('');
    setError('');
    setSuccess('');
  };

  // ── Forgot Password — Step 1: Enter mobile + new password → Send OTP ──
  const handleForgotSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await forgotPasswordRequest(forgotMobile, newPassword);
      setForgotStep('otp');
      setSuccess(`✅ OTP sent to +91 ${forgotMobile}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Forgot Password — Step 2: Verify OTP → Password changed ──────────
  const handleForgotVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await forgotPasswordVerify(forgotMobile, forgotOtp);
      showToast('✅ Password reset successful! Please login.', 'success');
      switchTab('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Header text based on active tab/step ──────────
  const getHeaderText = () => {
    if (activeTab === 'login')    return { title: 'Welcome Back 👋', sub: 'Login to book repairs and track your orders' };
    if (activeTab === 'register') return { title: 'Create Account 🎉', sub: 'Join thousands of happy customers' };
    if (activeTab === 'forgot') {
      if (forgotStep === 'mobile') return { title: 'Forgot Password 🔐', sub: 'Enter your mobile & set a new password' };
      if (forgotStep === 'otp')    return { title: 'Verify OTP 📲', sub: `OTP sent to +91 ${forgotMobile}` };
    }
    return { title: '', sub: '' };
  };

  const { title, sub } = getHeaderText();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" className="overflow-hidden" showCloseButton={false}>
      {/* Header */}
      <div className="bg-gradient-brand px-8 py-7 text-white relative">
        <h2 className="font-sora text-[22px] font-extrabold mb-1 tracking-tight">{title}</h2>
        <p className="font-manrope text-[13.5px] opacity-85 font-medium">{sub}</p>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-[34px] h-[34px] rounded-full bg-white/20 flex items-center justify-center transition-all hover:bg-white/30 hover:rotate-90"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Tabs — hide for forgot tab */}
      {activeTab !== 'forgot' && (
        <div className="flex border-b border-border">
          <button
            onClick={() => switchTab('login')}
            className={clsx(
              'flex-1 py-3.5 text-center font-manrope text-sm font-bold transition-all border-b-[3px]',
              activeTab === 'login'
                ? 'text-brand border-brand bg-white'
                : 'text-text-4 border-transparent bg-bg2'
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab('register')}
            className={clsx(
              'flex-1 py-3.5 text-center font-manrope text-sm font-bold transition-all border-b-[3px]',
              activeTab === 'register'
                ? 'text-brand border-brand bg-white'
                : 'text-text-4 border-transparent bg-bg2'
            )}
          >
            Create Account
          </button>
        </div>
      )}

      {/* Body */}
      <div className="p-7">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger-light text-danger border border-danger/20 font-manrope text-sm font-bold">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-light text-green border border-green/20 font-manrope text-sm font-bold">
            {success}
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Mobile Number"
              type="tel"
              icon={<i className="fas fa-phone"></i>}
              placeholder="10-digit mobile number"
              maxLength={10}
              value={loginData.mobile}
              onChange={(e) => setLoginData({ ...loginData, mobile: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={<i className="fas fa-lock"></i>}
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-text-4 hover:text-brand transition-colors"
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => switchTab('forgot')}
                className="text-sm text-brand font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              icon={<i className="fas fa-arrow-right"></i>}
              iconPosition="right"
            >
              {isLoading ? 'Logging in...' : 'Login to Gadgetfix365'}
            </Button>

            <p className="text-center text-sm text-text-3 font-medium mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('register')}
                className="text-brand font-extrabold hover:underline"
              >
                Create one
              </button>
            </p>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {activeTab === 'register' && (
          <>
            {registerStep === 'main' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  icon={<i className="fas fa-user"></i>}
                  placeholder="John Doe"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
                <Input
                  label="Mobile Number"
                  type="tel"
                  icon={<i className="fas fa-phone"></i>}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={registerData.mobile}
                  onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  icon={<i className="fas fa-envelope"></i>}
                  placeholder="you@example.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    icon={<i className="fas fa-lock"></i>}
                    placeholder="Min. 6 characters"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-text-4 hover:text-brand transition-colors"
                  >
                    <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  icon={<i className="fas fa-arrow-right"></i>}
                  iconPosition="right"
                >
                  {isLoading ? 'Creating account...' : 'Create My Account'}
                </Button>

                <p className="text-center text-sm text-text-3 font-medium mt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className="text-brand font-extrabold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <p className="text-sm text-text-2 text-center mb-4 font-medium">
                  OTP sent to +91 {registerData.mobile}
                </p>
                <Input
                  label="Enter OTP"
                  type="text"
                  icon={<i className="fas fa-key"></i>}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify & Activate Account'}
                </Button>
                <p className="text-center text-sm text-text-3 font-medium mt-4">
                  <button
                    type="button"
                    onClick={handleBackToRegister}
                    className="text-brand font-extrabold hover:underline"
                  >
                    ← Back to registration
                  </button>
                </p>
              </form>
            )}
          </>
        )}

        {/* ── FORGOT PASSWORD FLOW ── */}
        {activeTab === 'forgot' && (
          <>
            {/* Step 1 — Enter Mobile + New Password */}
            {forgotStep === 'mobile' && (
              <form onSubmit={handleForgotSendOTP} className="space-y-4">
                <Input
                  label="Registered Mobile Number"
                  type="tel"
                  icon={<i className="fas fa-phone"></i>}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={forgotMobile}
                  onChange={(e) => setForgotMobile(e.target.value)}
                  required
                />
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    icon={<i className="fas fa-lock"></i>}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-text-4 hover:text-brand transition-colors"
                  >
                    <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                  </button>
                </div>
                <Input
                  label="Confirm New Password"
                  type="password"
                  icon={<i className="fas fa-lock"></i>}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  icon={<i className="fas fa-paper-plane"></i>}
                  iconPosition="right"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
                <p className="text-center text-sm text-text-3 font-medium mt-4">
                  <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className="text-brand font-extrabold hover:underline"
                  >
                    ← Back to Login
                  </button>
                </p>
              </form>
            )}

            {/* Step 2 — Verify OTP */}
            {forgotStep === 'otp' && (
              <form onSubmit={handleForgotVerifyOTP} className="space-y-4">
                <Input
                  label="Enter OTP"
                  type="text"
                  icon={<i className="fas fa-key"></i>}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <p className="text-center text-sm text-text-3 font-medium mt-4">
                  <button
                    type="button"
                    onClick={() => { setForgotStep('mobile'); setError(''); setSuccess(''); }}
                    className="text-brand font-extrabold hover:underline"
                  >
                    ← Change mobile number
                  </button>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};