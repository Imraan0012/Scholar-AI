// =============================================================================
// SCHOLAR AI — CENTRAL API CLIENT FOR SPRING BOOT REST BACKEND
// Communicates with http://localhost:8000/api with Supabase JWT Bearer Tokens.
// =============================================================================

import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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

export const apiClient = {
  async get(endpoint, params = {}) {
    const headers = await getAuthHeaders();
    const url = new URL(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    return handleResponse(response);
  },

  async post(endpoint, body = {}) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    return handleResponse(response);
  },

  async put(endpoint, body = {}) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    return handleResponse(response);
  },

  async delete(endpoint) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'DELETE',
      headers
    });

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
