// =============================================================================
// SCHOLAR AI — CENTRAL API CLIENT FOR SPRING BOOT REST BACKEND
// Communicates with Spring Boot API using Supabase JWT Bearer Tokens.
// AbortController with 12-second timeout — Render cold-start never hangs.
// =============================================================================

import { supabase } from '../lib/supabaseClient.js';

// How long to wait for the Render backend before aborting (ms).
// Render free tier can take up to 30 s to wake, but we give 12 s then retry once.
const REQUEST_TIMEOUT_MS = 12_000;

export function getNormalizedApiBase() {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
                 (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
                 'http://localhost:8000/api';
  let base = envUrl.trim();
  base = base.replace(/\/+$/, ''); // Remove trailing slashes
  if (!base.endsWith('/api')) {
    base = `${base}/api`;
  }
  return base;
}

async function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.warn('[apiClient] Could not retrieve Supabase session token:', err.message);
  }

  return headers;
}

/**
 * Core fetch wrapper with AbortController timeout.
 * Throws a typed error on timeout so callers can distinguish cold-start from
 * genuine server errors.
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error('Request timed out — backend may be starting up. Please retry in a moment.');
      timeoutError.isTimeout = true;
      timeoutError.status = 408;
      throw timeoutError;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  async get(endpoint, params = {}) {
    const headers = await getAuthHeaders();
    const apiBase = getNormalizedApiBase();
    const url = new URL(`${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetchWithTimeout(url.toString(), {
      method: 'GET',
      headers
    });

    return handleResponse(response);
  },

  async post(endpoint, body = {}) {
    const headers = await getAuthHeaders();
    const apiBase = getNormalizedApiBase();
    const response = await fetchWithTimeout(
      `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      }
    );

    return handleResponse(response);
  },

  async put(endpoint, body = {}) {
    const headers = await getAuthHeaders();
    const apiBase = getNormalizedApiBase();
    const response = await fetchWithTimeout(
      `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      }
    );

    return handleResponse(response);
  },

  async delete(endpoint) {
    const headers = await getAuthHeaders();
    const apiBase = getNormalizedApiBase();
    const response = await fetchWithTimeout(
      `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
      {
        method: 'DELETE',
        headers
      }
    );

    return handleResponse(response);
  }
};

async function handleResponse(response) {
  let json;
  try {
    json = await response.json();
  } catch (e) {
    json = null;
  }

  if (!response.ok) {
    const errorMessage = json?.message || `HTTP ${response.status}: ${response.statusText}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = json;
    throw error;
  }

  // Unwrap standardized ApiResponse format { success: true, data: ... }
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data;
  }

  return json;
}
