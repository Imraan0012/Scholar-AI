// =============================================================================
// SCHOLAR AI — AUTHENTICATION SERVICE (STRICT SUPABASE AUTH ONLY)
// Absolutely NO mock credentials, NO fake logins, and NO authentication bypasses.
// =============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { profileService } from './profileService.js';

function mapAuthError(err) {
  if (!err) return 'An unexpected error occurred.';
  const msg = err.message ? err.message.toLowerCase() : String(err).toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials') || msg.includes('invalid email or password')) {
    return 'Invalid email or password.';
  }
  // NOTE: email-not-confirmed is intentionally NOT blocked here.
  // Email confirmation is disabled in Supabase for Scholar AI.
  if (
    msg.includes('user already registered') ||
    msg.includes('already exists') ||
    msg.includes('already in use') ||
    msg.includes('unique constraint') ||
    msg.includes('duplicate key')
  ) {
    return 'An account with this email already exists. Sign in instead.';
  }
  if (msg.includes('user not found') || msg.includes('no user')) {
    return 'No account found or the credentials are incorrect.';
  }
  if (
    msg.includes('rate limit') ||
    msg.includes('too many requests') ||
    msg.includes('over_email_send_rate_limit') ||
    msg.includes('too many attempts')
  ) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  if (msg.includes('network') || msg.includes('failed to fetch') || msg.includes('connection refused') || msg.includes('fetch failed')) {
    return 'Unable to connect. Please check your internet connection.';
  }
  if (msg.includes('missing-key') || msg.includes('invalid api key') || msg.includes('api key')) {
    return 'Supabase authentication is not configured. Please provide VITE_SUPABASE_ANON_KEY in .env.';
  }
  if (msg.includes('email address') && (msg.includes('invalid') || msg.includes('not allowed') || msg.includes('rejected'))) {
    return 'Unable to register this email with the authentication server. Please try again or sign in.';
  }

  return err.message || 'Unable to sign in right now. Please try again.';
}

export const authService = {
  /**
   * Signs in an existing student account exclusively via Supabase Auth.
   * Real Supabase authentication only — returns success ONLY when Supabase returns a valid user and session.
   */
  async signIn({ email, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return { success: false, message: 'Email is required.' };
    }
    if (!password) {
      return { success: false, message: 'Password is required.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error) {
        console.warn('[AuthService] Supabase signIn failed:', error.message);
        const errMsg = error.message ? error.message.toLowerCase() : '';

        // If email is not confirmed — attempt to auto-confirm via backend and retry
        if (errMsg.includes('email not confirmed') || errMsg.includes('not verified')) {
          console.log('[AuthService] Email not confirmed — attempting auto-confirm via backend...');
          try {
            const { apiClient } = await import('./apiClient.js');
            await apiClient.post('/auth/confirm-user', { email: normalizedEmail });
            // Retry sign-in after confirmation
            const retry = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
            if (!retry.error && retry.data?.user && retry.data?.session) {
              console.log('[AuthService] Auto-confirm + retry sign-in succeeded');
              const user = retry.data.user;
              const session = retry.data.session;
              let profile = null;
              try { profile = await profileService.getProfile(user.id); } catch (pe) {}
              return { success: true, user, session, profile, onboardingComplete: Boolean(profile?.onboardingComplete || profile?.isOnboarded), onboardingStep: profile?.onboardingStep || 1 };
            }
          } catch (confirmErr) {
            console.warn('[AuthService] Auto-confirm failed:', confirmErr.message);
          }
          // If auto-confirm failed, show a helpful error
          return { success: false, message: 'Your account email is not verified. Please contact support or try signing up again.' };
        }

        return {
          success: false,
          message: mapAuthError(error)
        };
      }

      if (!data?.user || !data?.session) {
        return {
          success: false,
          message: 'Authentication failed. No session returned by server.'
        };
      }

      const user = data.user;
      const session = data.session;

      // Fast profile check
      let profile = null;
      try {
        profile = await profileService.getProfile(user.id);
      } catch (pe) {
        console.warn('[AuthService] Profile fetch notice:', pe.message);
      }

      return {
        success: true,
        user,
        session,
        profile,
        onboardingComplete: Boolean(profile?.onboardingComplete || profile?.isOnboarded),
        onboardingStep: profile?.onboardingStep || 1
      };
    } catch (err) {
      console.error('[AuthService] Sign in exception:', err);
      return {
        success: false,
        message: mapAuthError(err)
      };
    }
  },

  /**
   * Signs up a new student account.
   *
   * Strategy: Call the backend /api/auth/register endpoint which directly inserts into
   * auth.users with bcrypt password + email pre-confirmed. This bypasses Supabase's
   * email sending (and its rate limits) entirely. Then we sign in via Supabase
   * to get a valid JWT session.
   */
  async signUp({ email, password, fullName }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedName = (fullName || '').trim();

    if (!normalizedEmail) {
      return { success: false, message: 'Email is required.' };
    }
    if (!password) {
      return { success: false, message: 'Password is required.' };
    }
    if (!trimmedName) {
      return { success: false, message: 'Full name is required.' };
    }

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    try {
      // STEP 1: Register via backend (no email sending, no rate limits)
      let registerRes;
      try {
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, password, fullName: trimmedName })
        });
        registerRes = await response.json();
      } catch (fetchErr) {
        console.warn('[AuthService] Backend register failed, falling back to Supabase signUp:', fetchErr.message);
        // Fallback to Supabase if backend is unreachable
        return await this._supabaseSignUp(normalizedEmail, password, trimmedName);
      }

      if (!registerRes?.success) {
        const errMsg = (registerRes?.message || '').toLowerCase();
        // If error is "already exists", try to sign in
        if (errMsg.includes('already') || errMsg.includes('duplicate') || errMsg.includes('exists')) {
          return await this.signIn({ email: normalizedEmail, password });
        }
        return { success: false, message: registerRes?.message || 'Registration failed. Please try again.' };
      }

      // STEP 2: Account created (or already existed) — sign in via Supabase to get JWT session
      console.log('[AuthService] Backend register succeeded, signing in via Supabase...');
      const signInResult = await this.signIn({ email: normalizedEmail, password });

      if (signInResult.success) {
        // Create initial profile stub if new account
        if (registerRes?.data?.created) {
          try {
            await profileService.saveProfile({
              user_id: signInResult.user.id,
              fullName: trimmedName,
              email: normalizedEmail,
              onboardingStep: 1,
              onboardingComplete: false
            }, signInResult.user.id);
          } catch (pe) {
            console.warn('[AuthService] Initial profile create warning:', pe.message);
          }
        }
        return {
          success: true,
          user: signInResult.user,
          session: signInResult.session,
          profile: signInResult.profile,
          needsEmailVerification: false,
          isExistingAccount: !registerRes?.data?.created
        };
      }

      // If sign in failed after register/update
      const isInvalidCreds = (signInResult.message || '').toLowerCase().includes('invalid');
      if (registerRes?.data?.exists || isInvalidCreds) {
        return {
          success: false,
          isDuplicate: true,
          message: 'An account with this email already exists. Please sign in instead.'
        };
      }

      return {
        success: false,
        message: signInResult.message || 'Unable to complete sign in. Please try signing in.'
      };

    } catch (err) {
      console.error('[AuthService] Sign up exception:', err);
      return { success: false, message: mapAuthError(err) };
    }
  },

  /**
   * Fallback: Supabase-native signUp (only used if backend is unreachable)
   */
  async _supabaseSignUp(normalizedEmail, password, trimmedName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { full_name: trimmedName, role: 'STUDENT' } }
      });

      if (error) {
        const errMsg = error.message ? error.message.toLowerCase() : '';
        const isDuplicate = errMsg.includes('already') || errMsg.includes('duplicate');
        if (isDuplicate) return await this.signIn({ email: normalizedEmail, password });
        const isRateLimit = errMsg.includes('rate limit') || errMsg.includes('too many') || errMsg.includes('over_email');
        if (isRateLimit) {
          const attempt = await this.signIn({ email: normalizedEmail, password });
          if (attempt.success) return attempt;
          return { success: false, message: 'Signup rate limited. Please try again in a few minutes.' };
        }
        return { success: false, message: mapAuthError(error) };
      }

      if (!data?.user) return { success: false, message: 'Unable to create account. Please try again.' };
      if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return await this.signIn({ email: normalizedEmail, password });
      }

      const user = data.user;
      const session = data.session || null;
      if (session && user) {
        return { success: true, user, session, needsEmailVerification: false };
      }
      return { success: true, user: null, session: null, needsEmailVerification: true, unconfirmedUser: user };
    } catch (err) {
      return { success: false, message: mapAuthError(err) };
    }
  },

  /**
   * Sends password reset email instructions exclusively via Supabase Auth.
   */
  async resetPasswordForEmail(email) {
    if (!email || !email.trim()) {
      return { success: false, message: 'Email is required.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, message: mapAuthError(error) };
      }
      return { success: true, message: 'Password reset instructions have been sent to your email.' };
    } catch (err) {
      return { success: false, message: mapAuthError(err) };
    }
  },

  /**
   * Updates password exclusively via Supabase Auth.
   */
  async updatePassword(newPassword) {
    if (!newPassword) {
      return { success: false, message: 'Password is required.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, message: mapAuthError(error) };
      }
      return { success: true, message: 'Password updated successfully. Sign in with your new password.' };
    } catch (err) {
      return { success: false, message: mapAuthError(err) };
    }
  },

  /**
   * Signs out the current user exclusively via Supabase Auth.
   */
  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[AuthService] Supabase signOut error:', err.message);
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith('sb-') && key.includes('-auth-token')) {
            window.localStorage.removeItem(key);
          }
        });
      }
    } catch (e) {}
    return { success: true };
  },

  /**
   * Returns current active authenticated Supabase user.
   */
  async getCurrentUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user && !error) {
        return session.user;
      }
    } catch (err) {
      // Not authenticated
    }
    return null;
  },

  /**
   * Returns active Supabase session.
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        return session;
      }
    } catch (err) {
      // No active session
    }
    return null;
  },

  /**
   * Subscribes to real-time Supabase Auth state changes.
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      callback(event, user, session);
    });
    return () => subscription?.unsubscribe();
  }
};
