import { Timestamp } from 'firebase/firestore';

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
  eventsAttended: EventAttendance[];
  eventsRegistered: EventRegistration[];
  deleted?: boolean;
  deletedAt?: Timestamp;
}

/**
 * Event document structure in Firestore
 */
export interface EventDocument {
  name: string;
  description: string;
  location: string;
  link?: string;
  start: Timestamp;
  end: Timestamp;
  attendees?: EventAttendee[];
  registered?: EventRegistration[];
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
export interface Event {
  id: string;
  title: string;
  name: string;
  date: Date;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  link?: string;
  attendees?: EventAttendee[];
}

/**
 * Simplified event for lists and displays
 */
export interface EventSummary {
  id: string;
  title: string;
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

/**
 * Contributor data (extends PersonData for contributors page)
 */
export interface ContributorData extends PersonData {
  // Inherits all PersonData fields
}

// =========================
// NESTED DOCUMENT TYPES
// =========================

/**
 * Event attendance record in user documents
 */
export interface EventAttendance {
  eventID: string;
  name: string;
  date: Date | Timestamp;
}

/**
 * Event registration record in user documents
 */
export interface EventRegistration {
  eventID: string;
  name?: string;
  title?: string;
  date: Date | Timestamp;
}

/**
 * Event attendee record in event documents
 */
export interface EventAttendee {
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
// COMPONENT PROP TYPES
// =========================

/**
 * Common navigation props for pages
 */
export interface NavigationProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

/**
 * Generic page props that includes navigation
 */
export interface PageProps extends NavigationProps {
  // Can be extended by specific page props
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