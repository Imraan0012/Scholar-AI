import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import studentGraduateImg from '../../assets/student_graduate.jpg';

export default function ForgotPasswordPage({ onSwitchToSignIn, onClose }) {
  const { resetPasswordForEmail } = useStudentProfile();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await resetPasswordForEmail(normalizedEmail);
      if (res.success) {
        setSuccessMsg(res.message || 'Password reset instructions have been sent to your email.');
      } else {
        setErrorMsg(res.message || 'Unable to process reset request. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#0c0d12] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative backdrop-blur-2xl">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Left Column: Form */}
      <div className="p-8 sm:p-12 flex flex-col justify-between">
        <div>
          {/* Top Logo Icon */}
          <div className="mb-8 flex items-center gap-1.5">
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

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Reset your password
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
            Enter your email to receive password reset instructions.
          </p>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 mb-4"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 my-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Check Your Email</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {successMsg}
                </p>
              </div>
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@yourdomain.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#14161f] border border-white/5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-xl shadow-cyan-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Send reset link</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back to Sign In Link */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-gray-400 hover:text-white font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
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
            Password Recovery
          </span>
        </div>
      </div>
    </div>
  );
}
