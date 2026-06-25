// src/components/modals/AuthModal.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@components/shared/Modal';
import { Button } from '@components/shared/Button';
import { Input } from '@components/shared/Input';
import { useAuth } from '@hooks/useAuth';
import { useUI } from '@hooks/useUI';
import clsx from 'clsx';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, register, verifyRegisterOTP, forgotPasswordRequest, forgotPasswordVerify } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login Form
  const [loginData, setLoginData] = useState({ mobile: '', password: '' });

  // Register Form
  const [registerData, setRegisterData] = useState({ name: '', mobile: '', email: '', password: '' });
  const [registerStep, setRegisterStep] = useState('main');
  const [otp, setOtp] = useState('');

  // Forgot Password Form
  const [forgotStep, setForgotStep] = useState('mobile');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login(loginData.mobile, loginData.password);
      showToast(`Welcome back, ${result.user_data.name}! 🎉`, 'success');
      onClose();
      if (result.user_data?.role === 'admin') navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(registerData.name, registerData.mobile, registerData.email, registerData.password);
      setRegisterStep('otp');
      setSuccess('✅ Account created! Enter the OTP sent to your mobile.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleForgotSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
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

  const getHeaderText = () => {
    if (activeTab === 'login')    return { title: 'Welcome Back 👋', sub: 'Login to book repairs and track your orders' };
    if (activeTab === 'register') return { title: 'Create Account ✨', sub: 'Join thousands of happy customers' };
    if (activeTab === 'forgot') {
      if (forgotStep === 'mobile') return { title: 'Forgot Password 🔐', sub: 'Enter your mobile & set a new password' };
      if (forgotStep === 'otp')    return { title: 'Verify OTP 📱', sub: `OTP sent to +91 ${forgotMobile}` };
    }
    return { title: '', sub: '' };
  };

  const { title, sub } = getHeaderText();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      fullBleed
      className="!bg-white"
    >
      {/* Full blue wrapper — no white gaps anywhere */}
      <div
        className="flex flex-col h-full"
        style={{ background: '#fff' }}
      >

        {/* ── Header ─────────────────────────────────────── */}
        <div
          className="px-7 py-6 relative flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h2 className="font-sora text-[21px] font-extrabold text-white mb-1 tracking-tight">
            {title}
          </h2>
          <p className="font-manrope text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {sub}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <i className="fas fa-times text-[13px]"></i>
          </button>
        </div>

        {/* ── Tabs ───────────────────────────────────────── */}
        {activeTab !== 'forgot' && (
          <div
            className="flex flex-shrink-0"
            style={{ borderBottom: '1px solid #e5e7eb' }}
          >
            {['login', 'register'].map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className="flex-1 py-3.5 font-manrope text-sm font-bold transition-all duration-200"
                style={{
                  background: activeTab === tab ? '#fff' : '#f9fafb',
                  color: activeTab === tab ? '#1d4ed8' : '#6b7280',
                  borderBottom: activeTab === tab ? '2.5px solid #1d4ed8' : '2.5px solid transparent',
                }}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
        )}

        {/* ── Body ───────────────────────────────────────── */}
        <div className="px-7 py-6 overflow-y-auto bg-white" style={{ maxHeight: '70vh' }}>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 p-3 rounded-xl font-manrope text-sm font-bold"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl font-manrope text-sm font-bold"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
              {success}
            </div>
          )}

          {/* ── LOGIN ── */}
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
                  className="absolute right-4 top-[38px] transition-colors"
                  style={{ color: '#9ca3af' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                </button>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchTab('forgot')}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: '#1d4ed8' }}
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}
                icon={<i className="fas fa-arrow-right"></i>} iconPosition="right">
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <p className="text-center text-sm font-medium mt-4" style={{ color: '#6b7280' }}>
                Don't have an account?{' '}
                <button type="button" onClick={() => switchTab('register')}
                  className="font-extrabold hover:underline" style={{ color: '#1d4ed8' }}>
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {activeTab === 'register' && (
            <>
              {registerStep === 'main' ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input label="Full Name" type="text" icon={<i className="fas fa-user"></i>}
                    placeholder="John Doe" value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
                  <Input label="Mobile Number" type="tel" icon={<i className="fas fa-phone"></i>}
                    placeholder="10-digit mobile number" maxLength={10} value={registerData.mobile}
                    onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })} required />
                  <Input label="Email Address" type="email" icon={<i className="fas fa-envelope"></i>}
                    placeholder="you@example.com" value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
                  <div className="relative">
                    <Input label="Password" type={showPassword ? 'text' : 'password'}
                      icon={<i className="fas fa-lock"></i>} placeholder="Min. 6 characters"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[38px] transition-colors"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                      <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}
                    icon={<i className="fas fa-arrow-right"></i>} iconPosition="right">
                    {isLoading ? 'Creating account...' : 'Create My Account'}
                  </Button>
                  <p className="text-center text-sm font-medium mt-4" style={{ color: '#6b7280' }}>
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchTab('login')}
                      className="font-extrabold hover:underline" style={{ color: '#1d4ed8' }}>
                      Sign in
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <p className="text-sm text-center font-medium mb-4" style={{ color: '#6b7280' }}>
                    OTP sent to +91 {registerData.mobile}
                  </p>
                  <Input label="Enter OTP" type="text" icon={<i className="fas fa-key"></i>}
                    placeholder="6-digit OTP" maxLength={6} value={otp}
                    onChange={(e) => setOtp(e.target.value)} required />
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify & Activate Account'}
                  </Button>
                  <p className="text-center text-sm font-medium mt-4" style={{ color: '#6b7280' }}>
                    <button type="button" onClick={handleBackToRegister}
                      className="font-extrabold hover:underline" style={{ color: '#1d4ed8' }}>
                      ← Back to registration
                    </button>
                  </p>
                </form>
              )}
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {activeTab === 'forgot' && (
            <>
              {forgotStep === 'mobile' && (
                <form onSubmit={handleForgotSendOTP} className="space-y-4">
                  <Input label="Registered Mobile Number" type="tel" icon={<i className="fas fa-phone"></i>}
                    placeholder="10-digit mobile number" maxLength={10} value={forgotMobile}
                    onChange={(e) => setForgotMobile(e.target.value)} required />
                  <div className="relative">
                    <Input label="New Password" type={showPassword ? 'text' : 'password'}
                      icon={<i className="fas fa-lock"></i>} placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[38px] transition-colors"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                      <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                  <Input label="Confirm New Password" type="password" icon={<i className="fas fa-lock"></i>}
                    placeholder="Re-enter new password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} required />
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}
                    icon={<i className="fas fa-paper-plane"></i>} iconPosition="right">
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                  <p className="text-center text-sm font-medium mt-4" style={{ color: '#6b7280' }}>
                    <button type="button" onClick={() => switchTab('login')}
                      className="font-extrabold hover:underline" style={{ color: '#1d4ed8' }}>
                      ← Back to Login
                    </button>
                  </p>
                </form>
              )}

              {forgotStep === 'otp' && (
                <form onSubmit={handleForgotVerifyOTP} className="space-y-4">
                  <Input label="Enter OTP" type="text" icon={<i className="fas fa-key"></i>}
                    placeholder="6-digit OTP" maxLength={6} value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)} required />
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <p className="text-center text-sm font-medium mt-4" style={{ color: '#6b7280' }}>
                    <button type="button"
                      onClick={() => { setForgotStep('mobile'); setError(''); setSuccess(''); }}
                      className="font-extrabold hover:underline" style={{ color: '#1d4ed8' }}>
                      ← Change mobile number
                    </button>
                  </p>
                </form>
              )}
            </>
          )}

        </div>
      </div>
    </Modal>
  );
};