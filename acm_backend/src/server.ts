// Backend server setup

import express, { Request, Response } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { EventDocument, EventAttendeeRecord, UserEventRecordDocument, ProfileDocument, BookingDocument } from './types';

import { 
  Profile,
  Event,
  Booking,
  EventSummary,
  Member,
  UserEventRecord
} from '../../shared/types';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: FirebaseFirestore.Timestamp): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return timestamp as any;
};

// Helper function to convert Date to Firestore timestamp
const toFirestoreTimestamp = (date: Date | string | null): FirebaseFirestore.Timestamp | undefined => {
  if (!date) {
    return undefined;
  }
  if (date instanceof Date) {
    return admin.firestore.Timestamp.fromDate(date);
  }
  if (typeof date === 'string') {
    return admin.firestore.Timestamp.fromDate(new Date(date));
  }
  return date as any;
};

// EVENTS API

// Get all events - returns Event[]
app.get('/api/events/all', async (req: Request, res: Response) => {
  try {
    const eventsQuery = db.collection("events");
    const eventsSnapshot = await eventsQuery.get();
    
    const events: Event[] = eventsSnapshot.docs.map(doc => {
      const data = doc.data() as EventDocument;
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        location: data.location,
        category: data.category,
        link: data.link,
        attendees: data.attendees as EventAttendeeRecord[],
        registered: data.registered as EventAttendeeRecord[],
        start: convertTimestamp(data.start),
        end: convertTimestamp(data.end)
      };
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Error fetching all events' });
  }
});

// Create new event - accepts Event, returns success message
app.post('/api/events', async (req: Request<{}, {}, Event>, res: Response) => {
  try {
    const {name, description, location, category, link, attendees, registered, start, end} = req.body;
    
    if (!name || !start || !end) {
      return res.status(400).json({ message: 'Name, start, and end are required' }); 
    }

    // Check if start and end are valid
    if (end <= start) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const eventDoc: EventDocument = {
      name,
      description,
      location,
      category,
      link,
      attendees: attendees as EventAttendeeRecord[],
      registered: registered as EventAttendeeRecord[],
      start: toFirestoreTimestamp(start)!,
      end: toFirestoreTimestamp(end)!
    };

    const docRef = await db.collection("events").add(eventDoc);
    
    res.status(201).json({ 
      message: 'Event created successfully',
      eventId: docRef.id 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Update event - accepts Event, returns success message
app.patch('/api/events/:eventId', async (req: Request<{eventId: string}, {}, Event>, res: Response) => {
  try {
    const { eventId } = req.params;
    const { name, description, location, category, link, attendees, registered, start, end } = req.body;
    const eventDoc: Partial<EventDocument> = {
      name,
      description,
      location,
      category,
      link,
      attendees,
      registered,
      start: toFirestoreTimestamp(start)!,
      end: toFirestoreTimestamp(end)!
    };
    
    await db.collection("events").doc(eventId).update(eventDoc);
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// RSVP for an event - accepts EventAttendeeRecord, returns success message
app.post('/api/events/:eventId/rsvp', async (req: Request<{eventId: string}, {}, EventAttendeeRecord>, res: Response) => {
  try {
    const { eventId } = req.params;
    const { uid, email } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ message: 'uid and email are required' });
    }

    // Get event details
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventData = eventDoc.data() as EventDocument;
    const eventDate = convertTimestamp(eventData.start);

    // Update event with new registration
    await db.collection("events").doc(eventId).update({
      registered: admin.firestore.FieldValue.arrayUnion({ uid, email })
    });

    // Update user with event registration
    await db.collection("users").doc(uid).update({
      eventsRegistered: admin.firestore.FieldValue.arrayUnion({ 
        date: toFirestoreTimestamp(eventDate)!, 
        eventID: eventId, 
        name: eventData.name 
      })
    });

    res.json({ message: 'Successfully registered for the event!' });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Error registering for event' });
  }
});

// USERS API

// Get user data - returns Profile
app.get('/api/users/:uid', async (req: Request<{uid: string}>, res: Response) => {
  try {
    const { uid } = req.params;
    const userDoc = await db.collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data() as ProfileDocument;
    const profile: Profile = {
      uid: userDoc.id,
      email: userData.email,
      isMember: userData.isMember,
      isOnMailingList: userData.isOnMailingList,
      eventsRegistered: (userData.eventsRegistered as UserEventRecordDocument[]).map((event: UserEventRecordDocument) => ({
        eventID: event.eventID,
        name: event.name,
        date: convertTimestamp(event.date)
      })),
      eventsAttended: (userData.eventsAttended as UserEventRecordDocument[]).map((event: UserEventRecordDocument) => ({
        eventID: event.eventID,
        name: event.name,
        date: convertTimestamp(event.date)
      })),
      deleted: userData.deleted || false,
      deletedAt: userData.deletedAt ? convertTimestamp(userData.deletedAt) : undefined
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Update user preferences - accepts Profile, returns success message
app.patch('/api/users/:uid', async (req: Request<{uid: string}, {}, Profile>, res: Response) => {
  try {
    const { uid } = req.params;
    const { email, isMember, isOnMailingList, deleted, deletedAt, eventsAttended, eventsRegistered } = req.body;
    const updatedUserDoc: Partial<ProfileDocument> = {
      email,
      isMember,
      isOnMailingList,
      ...(deleted && { deleted }),
      ...(deletedAt && { deletedAt: toFirestoreTimestamp(deletedAt) }),
      ...(eventsAttended && {
        eventsAttended: eventsAttended.map((event: UserEventRecord) => ({
          eventID: event.eventID,
          name: event.name,
          date: toFirestoreTimestamp(event.date)!
        }))
      }),
      ...(eventsRegistered && {
        eventsRegistered: eventsRegistered.map((event: UserEventRecord) => ({
          eventID: event.eventID,
          name: event.name,
          date: toFirestoreTimestamp(event.date)!
        }))
      })
    };

    await db.collection("users").doc(uid).update(updatedUserDoc);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete a user by uid - accepts {uid: string}, returns success message
app.post('/api/users/delete', async (req: Request<{}, {}, {uid: string}>, res: Response) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ message: 'uid is required' });
  }

  try {
    await admin.auth().deleteUser(uid);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

// BOOKINGS API

// Get user bookings - returns Booking[]
app.get('/api/bookings/user/:uid', async (req: Request<{uid: string}>, res: Response) => {
  try {
    const { uid } = req.params;
    const bookingsQuery = db.collection("bookings").where("uid", "==", uid);
    const bookingsSnapshot = await bookingsQuery.get();
    
    const bookings: Booking[] = bookingsSnapshot.docs.map(doc => {
      const data = doc.data() as BookingDocument;
      return {
        id: doc.id,
        uid: data.uid,
        start: convertTimestamp(data.start),
        end: convertTimestamp(data.end)
      };
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get all bookings for a week - returns Booking[]
app.get('/api/bookings/week', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const bookingsQuery = db.collection("bookings")
      .where("start", ">=", toFirestoreTimestamp(today)!)
      .where("start", "<=", toFirestoreTimestamp(weekEnd)!);
    
    const bookingsSnapshot = await bookingsQuery.get();
    const bookings: Booking[] = bookingsSnapshot.docs.map(doc => {
      const data = doc.data() as BookingDocument;
      return {
        id: doc.id,
        uid: data.uid,
        start: convertTimestamp(data.start),
        end: convertTimestamp(data.end)
      };
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching week bookings:', error);
    res.status(500).json({ message: 'Error fetching week bookings' });
  }
});

// Create new booking - accepts Booking, returns success message
app.post('/api/bookings', async (req: Request<{}, {}, Booking>, res: Response) => {
  try {
    const { uid, start, end } = req.body;
    
    if (!uid || !start || !end) {
      return res.status(400).json({ message: 'uid, start, and end are required' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Check if user already has a booking on this day
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(start);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookingsQuery = db.collection("bookings")
      .where("uid", "==", uid)
      .where("start", ">=", toFirestoreTimestamp(startOfDay)!)
      .where("start", "<=", toFirestoreTimestamp(endOfDay)!);

    const existingBookingsSnapshot = await existingBookingsQuery.get();
    if (!existingBookingsSnapshot.empty) {
      return res.status(400).json({ message: 'You already have a booking on this day' });
    }

    // Check for time slot conflicts
    const conflictQuery = db.collection("bookings")
      .where("start", "<", toFirestoreTimestamp(end)!)
      .where("end", ">", toFirestoreTimestamp(start)!);

    const conflictSnapshot = await conflictQuery.get();
    if (!conflictSnapshot.empty) {
      return res.status(400).json({ message: 'This time slot overlaps with an existing booking' });
    }

    const bookingData: BookingDocument = {
      uid,
      start: toFirestoreTimestamp(start)!,
      end: toFirestoreTimestamp(end)!
    };

    const bookingId = `${uid}${new Date(start).toDateString()}`;
    await db.collection("bookings").doc(bookingId).set(bookingData);
    
    res.status(201).json({ 
      message: 'Room successfully booked!',
      bookingId 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Delete booking - returns success message
app.delete('/api/bookings/:bookingId', async (req: Request<{bookingId: string}>, res: Response) => {
  try {
    const { bookingId } = req.params;
    await db.collection("bookings").doc(bookingId).delete();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking' });
  }
});

// ADMIN API

// Get all members - returns Member[]
app.get('/api/admin/members', async (req: Request, res: Response) => {
  try {
    const membersQuery = db.collection("users").where("isMember", "==", true);
    const membersSnapshot = await membersQuery.get();
    
    const members: Member[] = membersSnapshot.docs.map(doc => {
      const data = doc.data() as ProfileDocument;
      return {
        uid: doc.id,
        email: data.email,
        eventsAttended: data.eventsAttended?.length || 0
      };
    });

    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Error fetching members' });
  }
});

// Get past events for admin - returns EventSummary[]
app.get('/api/admin/events/past', async (req: Request, res: Response) => {
  try {
    const now = admin.firestore.Timestamp.now();
    const eventsQuery = db.collection("events")
      .where("end", "<", now)
      .orderBy("start", "desc");
    
    const eventsSnapshot = await eventsQuery.get();
    const events: EventSummary[] = eventsSnapshot.docs.map(doc => {
      const data = doc.data() as EventDocument;
      return {
        id: doc.id,
        name: data.name,
        date: convertTimestamp(data.start),
      };
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching past events:', error);
    res.status(500).json({ message: 'Error fetching past events' });
  }
});

// Upload attendance for an event - accepts {attendeeEmails: string[]}, returns success message
app.post('/api/admin/events/:eventId/attendance', async (req: Request<{eventId: string}, {}, {attendeeEmails: string[]}>, res: Response) => {
  try {
    const { eventId } = req.params;
    const { attendeeEmails } = req.body;
    
    if (!attendeeEmails || !Array.isArray(attendeeEmails)) {
      return res.status(400).json({ message: 'Attendee emails array is required' });
    }

    // Get the event details
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventData = eventDoc.data() as EventDocument;
    const eventDate = convertTimestamp(eventData.start);

    // Get all users whose emails match the attendees
    const usersQuery = db.collection("users").where("email", "in", attendeeEmails);
    const usersSnapshot = await usersQuery.get();

    // Create a map of existing users by email for quick lookup
    const existingUsersMap = new Map<string, EventAttendeeRecord>();
    usersSnapshot.docs.forEach(userDoc => {
      const userData = userDoc.data() as ProfileDocument;
      existingUsersMap.set(userData.email, {
        uid: userDoc.id,
        email: userData.email,
      });
    });

    // Prepare attendee records and user updates
    const attendees: EventAttendeeRecord[] = [];
    const userUpdatePromises: Promise<FirebaseFirestore.WriteResult>[] = [];
    const unknownAttendees: string[] = [];

    // Process each attendee email
    attendeeEmails.forEach(email => {
      const existingUser = existingUsersMap.get(email);
      
      if (existingUser) {
        // Known user - add to attendees and update their profile
        attendees.push(existingUser);
        userUpdatePromises.push(
          db.collection("users").doc(existingUser.uid).update({
            eventsAttended: admin.firestore.FieldValue.arrayUnion({
              date: toFirestoreTimestamp(eventDate)!,
              eventID: eventId,
              name: eventData.name
            })
          })
        );
      } else {
        // Unknown user - create attendee record with "unknown" uid
        const unknownAttendee: EventAttendeeRecord = {
          uid: "unknown",
          email: email,
        };
        attendees.push(unknownAttendee);
        unknownAttendees.push(email);
      }
    });

    // Update event with attendees
    if (attendees.length > 0) {
      const currentEventData = eventDoc.data() as EventDocument;
      const currentAttendees = currentEventData.attendees as EventAttendeeRecord[];
      const updatedAttendees = [...currentAttendees, ...attendees];
      
      await db.collection("events").doc(eventId).update({
        attendees: updatedAttendees
      });
    }

    // Update all known users
    if (userUpdatePromises.length > 0) {
      await Promise.all(userUpdatePromises);
    }

    res.json({ 
      message: 'Attendance uploaded successfully',
      attendeesCount: attendees.length,
      knownAttendeesCount: attendees.length - unknownAttendees.length,
      unknownAttendeesCount: unknownAttendees.length,
      unknownAttendees: unknownAttendees
    });
  } catch (error) {
    console.error('Error uploading attendance:', error);
    res.status(500).json({ message: 'Error uploading attendance' });
  }
});

// Remove member - returns success message
app.delete('/api/admin/members/:uid', async (req: Request<{uid: string}>, res: Response) => {
  try {
    const { uid } = req.params;
    
    // Update user in database
    await db.collection("users").doc(uid).update({
      isMember: false
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Error removing member' });
  }
});

// Create new user - accepts Profile, returns success message
app.post('/api/users', async (req: Request<{}, {}, Profile>, res: Response) => {
  try {
    const { uid, email, isMember, isOnMailingList, eventsAttended, eventsRegistered } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!uid) {
      return res.status(400).json({ message: 'uid is required' });
    }

    // Process events arrays safely
    const processEventsArray = (eventsArray: UserEventRecord[] | undefined): UserEventRecordDocument[] => {
      if (!eventsArray || !Array.isArray(eventsArray)) {
        return [];
      }
      return eventsArray.map(event => {
        if (!event || !event.eventID || !event.name) {
          console.warn('Invalid event record:', event);
          return null;
        }
        return {
          eventID: event.eventID,
          name: event.name,
          date: toFirestoreTimestamp(event.date)!
        };
      }).filter(Boolean) as UserEventRecordDocument[];
    };

    const userData: ProfileDocument = {
      email,
      isMember: isMember || false,
      isOnMailingList: isOnMailingList || false,
      eventsAttended: processEventsArray(eventsAttended),
      eventsRegistered: processEventsArray(eventsRegistered),
    };

    await db.collection("users").doc(uid).set(userData);
    
    res.status(201).json({ 
      message: 'User created successfully',
      uid: uid
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

