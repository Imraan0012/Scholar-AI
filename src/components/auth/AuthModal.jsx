import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';

export default function AuthModal({ isOpen, initialMode = 'signin', onClose, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Blur & Dimmer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl my-auto"
        >
          {mode === 'signin' && (
            <LoginPage
              onSwitchToSignUp={() => setMode('signup')}
              onSwitchToForgotPassword={() => setMode('forgot_password')}
              onClose={onClose}
              onSuccess={(authData) => onAuthSuccess?.(authData)}
            />
          )}

          {mode === 'signup' && (
            <SignUpPage
              onSwitchToSignIn={() => setMode('signin')}
              onClose={onClose}
              onSuccess={(authData) => onAuthSuccess?.(authData)}
            />
          )}

          {mode === 'forgot_password' && (
            <ForgotPasswordPage
              onSwitchToSignIn={() => setMode('signin')}
              onClose={onClose}
            />
          )}

          {mode === 'reset_password' && (
            <ResetPasswordPage
              onSwitchToSignIn={() => setMode('signin')}
              onClose={onClose}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
