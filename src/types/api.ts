// src/services/api.ts
import axios, { AxiosError } from 'axios';

// Determine the API base URL from environment variables.
// This is important for handling different environments (development, production).
// VITE_API_BASE_URL is typically used in Vite projects.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Creates an Axios instance with a predefined base URL and default headers.
 * This instance will be used for all API calls in the application.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Request timeout in milliseconds (10 seconds)
  headers: {
    'Content-Type': 'application/json', // Default content type for requests
  },
});

/**
 * Request Interceptor:
 * This interceptor is executed before each request is sent.
 * It's primarily used to attach the authentication token to the request headers.
 */
api.interceptors.request.use(
  (config) => {
    // Attempt to retrieve user data from localStorage
    const storedUser = localStorage.getItem('sportzen_user');

    if (storedUser) {
      try {
        // Parse the stored user data
        const user = JSON.parse(storedUser);
        // If a token exists, attach it as a Bearer token in the Authorization header
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        // Log an error if parsing fails and remove the invalid item from localStorage
        console.error("Error parsing user from localStorage in Axios interceptor:", e);
        localStorage.removeItem('sportzen_user'); // Clean up corrupted data
      }
    }
    return config; // Return the modified configuration
  },
  (error) => {
    // Handle request errors (e.g., network issues before sending the request)
    console.error("Axios request error:", error);
    return Promise.reject(error); // Propagate the error
  }
);

/**
 * Response Interceptor:
 * This interceptor is executed after a response is received, but before it's returned by the API call.
 * It's used for global error handling, like unauthorized access (401).
 */
api.interceptors.response.use(
  (response) => {
    // If the response is successful, simply return it
    return response;
  },
  (error: AxiosError) => {
    // Check if the error has a response from the server
    if (error.response) {
      console.error(
        `API Response Error - Status: ${error.response.status}`,
        'Data:', error.response.data,
        'Headers:', error.response.headers
      );

      // Handle specific status codes, e.g., 401 Unauthorized
      if (error.response.status === 401) {
        console.warn('Unauthorized access or token expired. Consider redirecting to login or refreshing token.');
        // IMPORTANT: In a production app, you might trigger a global logout
        // or a token refresh flow here (e.g., by dispatching an action to AuthContext
        // or a global state management system like Zustand).
        // For simplicity in this setup, the AuthContext already handles redirection
        // if isAuthenticated becomes false, which would happen if the token is invalid
        // and the user tries to fetch data.
      }
      // You can add more specific error handling based on status codes here (e.g., 403, 404, 500)
    } else if (error.request) {
      // The request was made but no response was received (e.g., network error, server down)
      console.error('No response received from server for the request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up Axios request:', error.message);
    }
    // Propagate the error so it can be caught by the calling service function (e.g., authService, userService)
    return Promise.reject(error);
  }
);

export default api;