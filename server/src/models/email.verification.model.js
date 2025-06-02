import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 300 seconds = 5 minutes
  }
});

const EmailVerification = mongoose.model('EmailVerification', otpSchema);
export default EmailVerification;