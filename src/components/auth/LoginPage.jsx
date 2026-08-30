import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import studentGraduateImg from '../../assets/student_graduate.jpg';

export default function LoginPage({ onSwitchToSignUp, onSwitchToForgotPassword, onClose, onSuccess }) {
  const { signIn } = useStudentProfile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const normalizedEmail = email.trim().toLowerCase();

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

    setLoading(true);

    try {
      const res = await signIn(normalizedEmail, password);
      if (res.success && res.user) {
        onSuccess?.(res);
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to sign in right now. Please try again.');
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

      {/* Left Column: Sign In Form */}
      <div className="p-6 sm:p-8 md:p-9 flex flex-col justify-between">
        <div>
          {/* Top Logo Icon */}
          <div className="mb-5 flex items-center gap-1.5">
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

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1.5">
            Welcome back!
          </h2>
          <p className="text-gray-400 text-xs sm:text-xs leading-relaxed mb-4">
            Sign in to continue discovering scholarships that match your profile.
          </p>

          {/* Clean Visual Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 mb-3.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14161f] border border-white/5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-300">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={onSwitchToForgotPassword}
                  className="text-[11px] text-gray-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#14161f] border border-white/5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-xl shadow-cyan-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>

        {/* Switch to Sign Up */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
          >
            Create one
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
