import { Timestamp } from 'firebase-admin/firestore';
import { BaseProfile, BaseEvent, BaseBooking, BaseUserEventRecord } from '../../shared/types';

// Backend-specific document types using Admin SDK Timestamp
export interface ProfileDocument extends BaseProfile {
  eventsAttended: UserEventRecordDocument[];
  eventsRegistered: UserEventRecordDocument[];
  deletedAt?: Timestamp;
}

export interface EventDocument extends BaseEvent {
  start: Timestamp;
  end: Timestamp;
}

export interface BookingDocument extends BaseBooking {
  start: Timestamp;
  end: Timestamp;
}

export interface UserEventRecordDocument extends BaseUserEventRecord {
  date: Timestamp;
}

export interface EventAttendeeRecord {
  uid: string;
  email: string;
}