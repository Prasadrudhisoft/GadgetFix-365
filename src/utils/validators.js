// src/utils/validators.js

export const validateMobile = (mobile) => {
  if (!mobile) return { valid: false, message: '📱 Mobile number is required' };
  if (mobile.length !== 10) return { valid: false, message: '📱 Mobile number must be 10 digits' };
  if (!/^\d+$/.test(mobile)) return { valid: false, message: '📱 Mobile number must contain only digits' };
  return { valid: true };
};

export const validateEmail = (email) => {
  if (!email) return { valid: false, message: '✉️ Email is required' };
  if (!email.includes('@')) return { valid: false, message: '✉️ Enter a valid email address' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { valid: false, message: '✉️ Enter a valid email address' };
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, message: '🔒 Password is required' };
  if (password.length < 6) return { valid: false, message: '🔒 Password must be at least 6 characters' };
  return { valid: true };
};

export const validateOTP = (otp) => {
  if (!otp) return { valid: false, message: '🔢 OTP is required' };
  if (otp.length !== 6) return { valid: false, message: '🔢 OTP must be 6 digits' };
  if (!/^\d+$/.test(otp)) return { valid: false, message: '🔢 OTP must contain only digits' };
  return { valid: true };
};

export const validatePincode = (pincode) => {
  if (!pincode) return { valid: false, message: '📍 Pincode is required' };
  if (pincode.length !== 6) return { valid: false, message: '📍 Pincode must be 6 digits' };
  if (!/^\d+$/.test(pincode)) return { valid: false, message: '📍 Pincode must contain only digits' };
  return { valid: true };
};

export const validateFile = (file) => {
  const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return { valid: false, message: `⚠️ ${file.name}: Only images and videos are allowed` };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return { valid: false, message: `⚠️ ${file.name}: Image must be under 2MB` };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return { valid: false, message: `⚠️ ${file.name}: Video must be under 20MB` };
  }

  return { valid: true };
};