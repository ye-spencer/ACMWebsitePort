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

export async function getUpcomingEvents() {
  return apiCall('/api/events/upcoming');
}

export async function getPastEvents() {
  return apiCall('/api/events/past');
}

export async function createEvent(eventData: {
  category: string;
  name: string;
  description: string;
  location: string;
  link: string;
  start: string;
  end: string;
}) {
  return apiCall('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

export async function rsvpForEvent(eventId: string, uid: string, email: string) {
  return apiCall(`/api/events/${eventId}/rsvp`, {
    method: 'POST',
    body: JSON.stringify({ uid, email }),
  });
}

export async function getAllEvents() {
  return apiCall('/api/events/all');
}

export async function updateEvent(eventId: string, updates: any) {
  return apiCall(`/api/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// USERS API

export async function getUserData(uid: string) {
  return apiCall(`/api/users/${uid}`);
}

export async function updateUser(uid: string, updates: any) {
  return apiCall(`/api/users/${uid}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function createUser(uid: string, email: string, eventsAttended: any[], eventsRegistered: any[]) {
  return apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify({ uid, email, eventsAttended, eventsRegistered }),
  });
}

export async function deleteUser(uid: string): Promise<void> {
  await apiCall('/deleteUser', {
    method: 'POST',
    body: JSON.stringify({ uid }),
  });
}

// BOOKINGS API

export async function getWeekBookings() {
  return apiCall('/api/bookings/week');
}

export async function createBooking(uid: string, start: string, end: string) {
  return apiCall('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ uid, start, end }),
  });
}

export async function getUserBookings(uid: string) {
  return apiCall(`/api/users/${uid}/bookings`);
}

export async function deleteBooking(bookingId: string) {
  return apiCall(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}

// ADMIN API

export async function getMembers() {
  return apiCall('/api/admin/members');
}

export async function getPastEventsForAdmin() {
  return apiCall('/api/admin/events/past');
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

