import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import studentGraduateImg from '../../assets/student_graduate.jpg';

export default function SignUpPage({ onSwitchToSignIn, onClose, onSuccess }) {
  const { signUp } = useStudentProfile();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pass)) return 'Password must include at least one uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must include at least one lowercase letter.';
    if (!/[0-9]/.test(pass)) return 'Password must include at least one number.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsDuplicate(false);

    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!normalizedEmail) {
      setErrorMsg('Email is required.');
      return;
    }
    if (!emailRegex.test(normalizedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      setErrorMsg(passError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting Supabase signup:', { normalizedEmail, fullName: trimmedName });
      const res = await signUp(normalizedEmail, password, trimmedName);
      console.log('Signup result:', res);

      if (res.success) {
        if (res.needsEmailVerification) {
          setEmailVerificationPending(true);
        } else if (res.user && res.session) {
          // Signed up and immediately authenticated (email confirmation disabled)
          onSuccess?.(res);
        }
      } else {
        const isDup = res.isDuplicate || (res.message && (
          res.message.toLowerCase().includes('already exists') ||
          res.message.toLowerCase().includes('already registered') ||
          res.message.toLowerCase().includes('already in use') ||
          res.message.toLowerCase().includes('sign in instead')
        ));

        const isRateLimit = res.message && (
          res.message.toLowerCase().includes('too many') ||
          res.message.toLowerCase().includes('rate limit') ||
          res.message.toLowerCase().includes('wait a moment') ||
          res.message.toLowerCase().includes('wait a few')
        );

        if (isDup) {
          setIsDuplicate(true);
          setErrorMsg('An account with this email already exists. Please sign in.');
        } else if (isRateLimit) {
          // Rate limit — user likely already registered. Guide them to sign in.
          setIsDuplicate(true);
          setErrorMsg('Too many signup attempts. If you already have an account, please sign in instead.');
        } else {
          setErrorMsg(res.message || 'Unable to create your account right now. Please try again.');
        }
      }
    } catch (err) {
      console.error('Signup error caught:', err);
      setErrorMsg(err.message || 'Unable to create your account right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[840px] bg-[#0c0d12] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative backdrop-blur-2xl">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Left Column: Sign Up Form */}
      <div className="p-6 sm:p-7 md:p-8 flex flex-col justify-between">
        <div>
          {/* Top Logo Icon */}
          <div className="mb-4 flex items-center gap-1.5">
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-white" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-transparent" />
              </div>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-transparent" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-white" />
              </div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
            Create your account
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-3.5">
            Join Scholar AI to discover scholarships that match your profile.
          </p>

          {/* Clean Visual Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2.5 mb-3"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <span>{errorMsg}</span>
                {isDuplicate && (
                  <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="ml-2 text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors cursor-pointer"
                  >
                    Sign in instead.
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Email Verification Pending Screen */}
          {emailVerificationPending ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3.5 my-3"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white mb-1">Account created successfully.</h4>
                <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
                  Please check your email to verify your account before signing in.
                </p>
              </div>
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="e.g. Mohamed Imraan"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14161f] border border-white/5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="youremail@yourdomain.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14161f] border border-white/5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2 pr-10 rounded-xl bg-[#14161f] border border-white/5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Confirm password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2 pr-10 rounded-xl bg-[#14161f] border border-white/5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirement Hint */}
              <div className="text-[10.5px] sm:text-[11px] text-gray-400 flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Must be 8+ chars with uppercase, lowercase, & numbers</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-xl shadow-cyan-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2.5"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <span>Create account</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Switch to Sign In */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Right Column: Student Graduate Background Photo */}
      <div className="hidden md:flex flex-col justify-between p-8 m-3 rounded-[22px] relative overflow-hidden border border-white/10 min-h-[440px] bg-[#14161f]">
        <img
          src={studentGraduateImg || '/student_graduate.jpg'}
          alt="Indian Graduate Student"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-3xl bg-white/[0.05] border border-white/20 rotate-45 pointer-events-none" />
        <div className="absolute top-1/4 right-6 w-36 h-36 rounded-3xl bg-white/[0.05] border border-white/20 rotate-45 pointer-events-none" />
        <div className="absolute bottom-6 left-4 w-44 h-44 rounded-3xl bg-white/[0.05] border border-white/20 rotate-45 pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10">
          <span className="px-3.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-lg">
            Scholar AI
          </span>
          <span className="px-3.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-lg">
            100% Free
          </span>
        </div>
      </div>
    </div>
  );
}
