import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import logo from '../assets/logo.svg';

export default function Register() {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Email is required');

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email: email.trim() });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim() || otp.length !== 6) return setError('Enter valid 6-digit OTP');

    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp: otp.trim() });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      await register(name.trim(), email, password);
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      setError('');
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 via-sand-50 to-sage-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-sage-500 to-sage-700 rounded-3xl shadow-lg mb-4 overflow-hidden p-4">
            <img src={logo} alt="ThinkWell" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <h1 className="text-3xl font-bold text-earth-900">ThinkWell</h1>
          <p className="text-earth-500 mt-2">Start your wellness journey</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-sage-600 text-white' : 'bg-earth-200 text-earth-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-sage-600' : 'bg-earth-200'}`} />}
            </div>
          ))}
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-earth-100 p-8">
          {error && (
            <div className="mb-4 p-3 bg-clay-50 border border-clay-200 rounded-xl text-clay-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-sage-600" />
                <h2 className="text-xl font-semibold text-earth-900">Enter your email</h2>
              </div>
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-earth-400 mt-1.5">We'll send a 6-digit verification code</p>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? 'Sending...' : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-sage-600" />
                <h2 className="text-xl font-semibold text-earth-900">Verify OTP</h2>
              </div>
              <p className="text-sm text-earth-500 mb-4">
                Enter the 6-digit code sent to <strong className="text-earth-700">{email}</strong>
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input-field text-center text-2xl font-mono tracking-[0.5em] py-4"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? 'Verifying...' : <><span>Verify Code</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-earth-500 hover:text-earth-700">
                  ← Change email
                </button>
                <button onClick={resendOTP} disabled={loading} className="text-sm text-sage-600 font-medium hover:text-sage-700">
                  Resend OTP
                </button>
              </div>
            </>
          )}

          {/* Step 3: Complete Profile */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-sage-600" />
                <h2 className="text-xl font-semibold text-earth-900">Complete your profile</h2>
              </div>
              <div className="mb-4 p-2.5 bg-sage-50 border border-sage-100 rounded-lg text-xs text-sage-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Email verified: {email}
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Your name"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pr-11"
                      placeholder="Min 6 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base disabled:opacity-50">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-earth-500">
            Already have an account?{' '}
            <Link to="/login" className="text-sage-600 font-medium hover:text-sage-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
