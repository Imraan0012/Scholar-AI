import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, UserPlus, Shield } from 'lucide-react';
import { useStudentProfile } from '../../context/StudentProfileContext';

export default function GoogleOAuthModal({ isOpen, onClose, onSuccess }) {
  const { updateProfile } = useStudentProfile();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);

  const googleAccounts = [
    {
      name: 'Mohamed Imraan',
      email: 'mohamedimraan2003@gmail.com',
      avatar: 'MI',
      color: 'bg-indigo-600'
    },
    {
      name: 'Student Scholar',
      email: 'scholar.student@gmail.com',
      avatar: 'SS',
      color: 'bg-emerald-600'
    }
  ];

  const handleSelectAccount = (acc) => {
    setSelectedAccount(acc.email);
    setAuthenticating(true);

    // Sync student identity directly into profile context
    updateProfile({
      fullName: acc.name,
      email: acc.email
    });

    setTimeout(() => {
      setAuthenticating(false);
      onSuccess?.(acc);
      onClose?.();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Google OAuth Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative z-10 w-full max-w-md bg-[#13151f] border border-white/15 rounded-3xl p-7 text-white shadow-2xl overflow-hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.9 7.4C.7 9.8 0 12.4 0 15.2s.7 5.4 1.9 7.8l3.7-2.9z" />
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
              </svg>
              <span className="text-sm font-bold text-white tracking-wide">Sign in with Google</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Heading */}
          <div className="py-5 text-center">
            <h3 className="text-lg font-bold text-white">Choose an account</h3>
            <p className="text-xs text-gray-400 mt-1">
              to continue to <span className="text-cyan-400 font-semibold">Scholar AI Platform</span>
            </p>
          </div>

          {/* Account Selection List */}
          <div className="space-y-2.5">
            {googleAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={authenticating}
                onClick={() => handleSelectAccount(acc)}
                className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                  selectedAccount === acc.email && authenticating
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-[#181a27] hover:bg-[#202334] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-full ${acc.color} flex items-center justify-center font-bold text-white text-sm shadow-md`}>
                    {acc.avatar}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-white block truncate">{acc.name}</span>
                    <span className="text-xs text-gray-400 block truncate">{acc.email}</span>
                  </div>
                </div>

                {selectedAccount === acc.email && authenticating ? (
                  <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                ) : (
                  <span className="text-xs text-gray-500 font-semibold group-hover:text-gray-300">Google</span>
                )}
              </button>
            ))}

            {/* Use Another Account Button */}
            <button
              type="button"
              disabled={authenticating}
              onClick={() => handleSelectAccount({ name: 'Mohamed Imraan', email: 'mohamedimraan2003@gmail.com', avatar: 'MI', color: 'bg-indigo-600' })}
              className="w-full p-3.5 rounded-2xl border border-dashed border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center gap-3.5 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300">
                <UserPlus className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-300">Use another account</span>
            </button>
          </div>

          {/* Privacy Footnote */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>OAuth 2.0 Secure Authentication</span>
            </div>
            <a href="#privacy" className="hover:text-gray-300 underline">Privacy Policy</a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
