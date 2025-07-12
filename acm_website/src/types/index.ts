import { Timestamp } from 'firebase/firestore';

export interface BaseEvent {
  name: string;
  description: string;
  location: string;
  category: string;
  link?: string;
  attendees?: EventAttendeeRecord[];
  registered?: EventAttendeeRecord[];
}

// =========================
// DATABASE DOCUMENT TYPES
// =========================

/**
 * User document structure in Firestore
 */
export interface UserDocument {
  email: string;
  isMember: boolean;
  isOnMailingList: boolean;
  eventsAttended: UserEventRecord[];
  eventsRegistered: UserEventRecord[];
  deleted?: boolean;
  deletedAt?: Timestamp;
}

/**
 * Event document structure in Firestore
 */
export interface EventDocument extends BaseEvent {
  start: Timestamp;
  end: Timestamp;
}

/**
 * Booking document structure in Firestore
 */
export interface BookingDocument {
  UID: string;
  start: Timestamp;
  end: Timestamp;
}

// =========================
// SHARED INTERFACE TYPES
// =========================

/**
 * Event data with converted dates for frontend use
 */
export interface Event extends BaseEvent {
  id: string;
  date: Date;
  start_time: string;
  end_time: string;
}

/**
 * Simplified event for lists and displays
 */
export interface EventSummary {
  id: string;
  name: string;
  date: Date;
}

/**
 * Booking data with converted dates for frontend use
 */
export interface Booking {
  id: string;
  start: Date;
  end: Date;
}

/**
 * User member data for admin management
 */
export interface Member {
  uid: string;
  email: string;
  eventsAttended: number;
}

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

// =========================
// NESTED DOCUMENT TYPES
// =========================

/**
 * Event attendance or registration record in user documents
 */
export interface UserEventRecord {
  eventID: string;
  name: string;
  date: Date | Timestamp;
}

/**
 * Event attendee record in event documents
 */
export interface EventAttendeeRecord {
  uid: string;
  email: string;
}

/**
 * Spreadsheet row data for attendance uploads
 */
export interface SpreadsheetRow {
  Email?: string;
  email?: string;
  [key: string]: unknown;
}

// =========================
// UTILITY TYPES
// =========================

/**
 * Converts Firestore document with Timestamp to frontend-friendly format
 */
export type FirestoreToFrontend<T> = {
  [K in keyof T]: T[K] extends Timestamp ? Date : T[K];
};

/**
 * Helper type for optional fields in updates
 */
export type PartialUpdate<T> = {
  [K in keyof T]?: T[K];
};