import { Booking, EventAttendeeRecord, Event, EventSummary, Member, Profile } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// EVENTS API

export async function getAllEvents() {
  return apiCall('/api/events/all') as Promise<Event[]>
}

export async function createEvent(event: Partial<Event>) {
  return apiCall('/api/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

export async function rsvpForEvent(eventId: string, eventAttendee: EventAttendeeRecord) {
  return apiCall(`/api/events/${eventId}/rsvp`, {
    method: 'POST',
    body: JSON.stringify(eventAttendee),
  });
}

export async function updateEvent(event: Event) {
  return apiCall(`/api/events/${event.id}`, {
    method: 'PATCH',
    body: JSON.stringify(event),
  });
}

// USERS API

export async function getUserData(uid: string) {
  return apiCall(`/api/users/${uid}`) as Promise<Profile>;
}

export async function updateUser(updates: Profile) {
  return apiCall(`/api/users/${updates.uid}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function createUser(userData: Profile) {
  return apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(uid: string): Promise<void> {
  await apiCall('/api/users/delete', {
    method: 'POST',
    body: JSON.stringify({ uid }),
  });
}

// BOOKINGS API

export async function getWeekBookings() {
  return apiCall('/api/bookings/week') as Promise<Booking[]>;
}

export async function createBooking(booking: Partial<Booking>) {
  return apiCall('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  });
}

export async function getUserBookings(uid: string) {
  return apiCall(`/api/bookings/user/${uid}`) as Promise<Booking[]>;
}

export async function deleteBooking(bookingId: string) {
  return apiCall(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}

// ADMIN API

export async function getMembers() {
  return apiCall('/api/admin/members') as Promise<Member[]>;
}

export async function getPastEventsForAdmin() {
  return apiCall('/api/admin/events/past') as Promise<EventSummary[]>;
}

export async function uploadAttendance(eventId: string, attendeeEmails: string[]) {
  return apiCall(`/api/admin/events/${eventId}/attendance`, {
    method: 'POST',
    body: JSON.stringify({ attendeeEmails }),
  });
}

export async function removeMember(uid: string) {
  return apiCall(`/api/admin/members/${uid}`, {
    method: 'DELETE',
  });
}

