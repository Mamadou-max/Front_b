// src/utils/formatDate.ts

/**
 * Defines the available date formatting options.
 */
export type DateFormat =
  | 'YYYY-MM-DD'           // e.g., "2025-06-26"
  | 'DD/MM/YYYY'           // e.g., "26/06/2025"
  | 'MM/DD/YYYY'           // e.g., "06/26/2025"
  | 'DD MMMM YYYY'         // e.g., "26 June 2025"
  | 'MMMM DD, YYYY'        // e.g., "June 26, 2025"
  | 'YYYY-MM-DD HH:mm'     // e.g., "2025-06-26 14:30"
  | 'DD/MM/YYYY HH:mm'     // e.g., "26/06/2025 14:30"
  | 'fullDateTime'         // e.g., "Thursday, June 26, 2025 at 2:38 PM" (locale-dependent)
  | 'shortDate'            // e.g., "6/26/2025" (locale-dependent)
  | 'shortTime'            // e.g., "2:38 PM" (locale-dependent)
  | 'relative';            // e.g., "just now", "2 hours ago", "yesterday" (requires more logic, see note)


/**
 * Formats a given date value into a human-readable string based on the specified format.
 *
 * @param dateInput - The date to format. Can be a Date object, a number (timestamp), or a string.
 * @param format - The desired output format. Defaults to 'DD/MM/YYYY HH:mm'.
 * @param locale - The locale string to use for formatting (e.g., 'en-US', 'fr-FR'). Defaults to 'en-US'.
 * @returns The formatted date string, or an empty string if the input is invalid.
 */
export const formatDate = (
  dateInput: Date | string | number | null | undefined,
  format: DateFormat = 'DD/MM/YYYY HH:mm',
  locale: string = 'en-US' // Default to a common locale
): string => {
  if (!dateInput) {
    return '';
  }

  let date: Date;
  try {
    date = new Date(dateInput);
  } catch (e) {
    console.error('Invalid date input provided to formatDate:', dateInput, e);
    return ''; // Return empty string for invalid dates
  }

  if (isNaN(date.getTime())) {
    console.error('Invalid date object after parsing:', dateInput);
    return ''; // Return empty string if date is not valid
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  // const seconds = date.getSeconds().toString().padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD MMMM YYYY':
      return date.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
    case 'MMMM DD, YYYY':
      return date.toLocaleDateString(locale, { month: 'long', day: '2-digit', year: 'numeric' });
    case 'YYYY-MM-DD HH:mm':
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'fullDateTime':
      return date.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
      });
    case 'shortDate':
      return date.toLocaleDateString(locale);
    case 'shortTime':
      return date.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric' });
    case 'relative':
        // NOTE: Implementing "relative" time (e.g., "2 hours ago", "yesterday")
        // is significantly more complex and often requires a dedicated library like `date-fns`
        // or `moment.js` (though moment.js is often discouraged for new projects).
        // This simple utility won't provide full relative time out of the box.
        // For a full robust solution, consider:
        // import { formatDistanceToNowStrict } from 'date-fns';
        // return formatDistanceToNowStrict(date, { addSuffix: true, locale: yourLocaleObject });
        console.warn("Relative date formatting is a complex feature not fully implemented in this utility. Consider a library like date-fns.");
        return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' }); // Fallback
    default:
      // Fallback for unsupported or unknown formats
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
  }
};