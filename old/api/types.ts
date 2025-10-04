import { Timestamp } from 'firebase-admin/firestore';
import { BaseProfile, BaseEvent, BaseBooking, BaseUserEventRecord } from '../shared/types';

// Backend-specific document types using Admin SDK Timestamp

export type ProfileDocument = {
  email: string;
  isMember: boolean;
  isOnMailingList: boolean;
  eventsAttended: UserEventRecordDocument[];
  eventsRegistered: UserEventRecordDocument[];
  deleted?: boolean;
  deletedAt?: Timestamp;
};

export type EventDocument = {
  name: string;
  description: string;
  location: string;
  category: string;
  link?: string;
  attendees: EventAttendeeRecord[];
  registered: EventAttendeeRecord[];
  start: Timestamp;
  end: Timestamp;
};

export type BookingDocument = {
  uid: string;
  start: Timestamp;
  end: Timestamp;
};

export type UserEventRecordDocument = {
  eventID: string;
  name: string;
  date: Timestamp;
};

// =========================

export type EventAttendeeRecord = {
  uid: string;
  email: string;
};