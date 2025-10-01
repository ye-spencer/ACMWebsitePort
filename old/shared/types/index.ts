export interface BaseEvent {
  name: string;
  description: string;
  location: string;
  category: string;
  link?: string;
  attendees: EventAttendeeRecord[];
  registered: EventAttendeeRecord[];
}

export interface BaseProfile {
  email: string;
  isMember: boolean;
  isOnMailingList: boolean;
  deleted?: boolean;
}

export interface BaseBooking {
  uid: string;
}

export interface BaseUserEventRecord {
  eventID: string;
  name: string;
}

// =========================
// SHARED INTERFACE TYPES
// =========================

/**
 * User data with converted dates for frontend use
 */
export interface Profile extends BaseProfile {
  uid: string;
  eventsAttended: UserEventRecord[];
  eventsRegistered: UserEventRecord[];
  deletedAt?: Date;
}

/**
 * Event data with converted dates for frontend use
 */
export interface Event extends BaseEvent {
  id: string;
  start: Date;
  end: Date;
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
export interface Booking extends BaseBooking {
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

// =========================
// NESTED DOCUMENT TYPES
// =========================

/**
 * Event attendance or registration record in user documents
 */
export interface UserEventRecord extends BaseUserEventRecord {
  date: Date;
}

/**
 * Event attendee record in event documents
 */
export interface EventAttendeeRecord {
  uid: string;
  email: string;
}

// =========================
// UTILITY TYPES
// =========================

/**
 * Converts Firestore document with Timestamp to frontend-friendly format
 */
export type FirestoreToFrontend<T> = {
  [K in keyof T]: T[K] extends any ? Date : T[K];
};

/**
 * Helper type for optional fields in updates
 */
export type PartialUpdate<T> = {
  [K in keyof T]?: T[K];
};