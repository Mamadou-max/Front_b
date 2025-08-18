// src/types/user.ts

/**
 * Defines the core structure of a User object in the SportZen application.
 * This interface is used globally across contexts, services, and components.
 */
export interface User {
  id: string; // Unique identifier for the user
  email: string; // User's email address (typically unique and used for login)
  firstName?: string; // Optional: User's first name
  lastName?: string; // Optional: User's last name
  role: 'B2C' | 'B2B' | 'admin'; // User's role within the system
  token: string; // Authentication token for API requests
  // Add any other core user properties that are consistently returned by your API
  // For example:
  // profilePictureUrl?: string;
  // bio?: string;
  // createdAt: string;
  // updatedAt: string;
}

// You can add other user-related types here if needed, for example:
// export interface UserPreferences {
//   theme: 'light' | 'dark';
//   notificationsEnabled: boolean;
// }