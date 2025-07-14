export * from '../../../shared/types';

// =========================
// FRONTEND TYPES
// =========================

/**
 * Time slot for booking system
 */
export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

/**
 * Person data for team displays
 */
export interface PersonData {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  imagePath?: string;
}

/**
 * Spreadsheet row data for attendance uploads
 */
export interface SpreadsheetRow {
  Email?: string;
  email?: string;
  [key: string]: unknown;
}
