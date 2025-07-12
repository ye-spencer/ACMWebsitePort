// Backend server setup

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

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
const convertTimestamp = (timestamp) => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return timestamp;
};

// Helper function to convert Date to Firestore timestamp
const toFirestoreTimestamp = (date) => {
  if (date instanceof Date) {
    return admin.firestore.Timestamp.fromDate(date);
  }
  return date;
};

// EVENTS API

// Get upcoming events
app.get('/api/events/upcoming', async (req, res) => {
  try {
    const now = admin.firestore.Timestamp.now();
    const eventsQuery = db.collection("events")
      .where("start", ">=", now)
      .orderBy("start", "desc");
    
    const eventsSnapshot = await eventsQuery.get();
    const events = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        category: data.category || 'Other',
        name: data.name || 'Untitled Event',
        date: convertTimestamp(data.start),
        start_time: data.start ? convertTimestamp(data.start).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : 'TBD',
        end_time: data.end ? convertTimestamp(data.end).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : 'TBD',
        location: data.location || 'TBD',
        description: data.description || '',
      };
    });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ message: 'Error fetching upcoming events' });
  }
});

// Get past events
app.get('/api/events/past', async (req, res) => {
  try {
    const now = admin.firestore.Timestamp.now();
    const eventsQuery = db.collection("events")
      .where("start", "<", now)
      .orderBy("start", "desc");
    
    const eventsSnapshot = await eventsQuery.get();
    const events = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        category: data.category || 'Other',
        name: data.name || 'Untitled Event',
        date: convertTimestamp(data.start),
        start_time: data.start ? convertTimestamp(data.start).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : 'TBD',
        end_time: data.end ? convertTimestamp(data.end).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : 'TBD',
        location: data.location || 'TBD',
        description: data.description || '',
      };
    });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching past events:', error);
    res.status(500).json({ message: 'Error fetching past events' });
  }
});

// Create new event
app.post('/api/events', async (req, res) => {
  try {
    const { category, name, description, location, link, start, end } = req.body;
    
    if (!name || !start || !end) {
      return res.status(400).json({ message: 'Name, start, and end are required' });
    }

    const startDateTime = new Date(start);
    const endDateTime = new Date(end);

    if (endDateTime <= startDateTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const eventData = {
      category: category || 'Other',
      name,
      description: description || '',
      location: location || 'TBD',
      link: link || '',
      start: toFirestoreTimestamp(startDateTime),
      end: toFirestoreTimestamp(endDateTime),
      registered: [],
      attendees: []
    };

    const docRef = await db.collection("events").add(eventData);
    
    res.status(201).json({ 
      message: 'Event created successfully',
      eventId: docRef.id 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// RSVP for an event
app.post('/api/events/:eventId/rsvp', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { uid, email } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ message: 'UID and email are required' });
    }

    // Get event details
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventData = eventDoc.data();
    const eventDate = convertTimestamp(eventData.start);

    // Update event with new registration
    await db.collection("events").doc(eventId).update({
      registered: admin.firestore.FieldValue.arrayUnion({ uid, email })
    });

    // Update user with event registration
    await db.collection("users").doc(uid).update({
      eventsRegistered: admin.firestore.FieldValue.arrayUnion({ 
        date: eventDate, 
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

// Get user data
app.get('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userDoc = await db.collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({
      uid: userDoc.id,
      email: userData.email,
      isMember: userData.isMember || false,
      isOnMailingList: userData.isOnMailingList || false,
      eventsRegistered: userData.eventsRegistered || [],
      eventsAttended: userData.eventsAttended || []
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Update user preferences
app.patch('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;
    
    // Convert dates to Firestore timestamps if present
    const processedUpdates = {};
    Object.keys(updates).forEach(key => {
      if (key === 'deletedAt' && updates[key]) {
        processedUpdates[key] = toFirestoreTimestamp(new Date(updates[key]));
      } else {
        processedUpdates[key] = updates[key];
      }
    });

    await db.collection("users").doc(uid).update(processedUpdates);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete a user by UID
app.post('/deleteUser', async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ message: 'UID is required' });
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

// Get user bookings
app.get('/api/users/:uid/bookings', async (req, res) => {
  try {
    const { uid } = req.params;
    const bookingsQuery = db.collection("bookings").where("UID", "==", uid);
    const bookingsSnapshot = await bookingsQuery.get();
    
    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      start: convertTimestamp(doc.data().start),
      end: convertTimestamp(doc.data().end)
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get all bookings for a week
app.get('/api/bookings/week', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const bookingsQuery = db.collection("bookings")
      .where("start", ">=", toFirestoreTimestamp(today))
      .where("start", "<=", toFirestoreTimestamp(weekEnd));
    
    const bookingsSnapshot = await bookingsQuery.get();
    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      start: convertTimestamp(doc.data().start),
      end: convertTimestamp(doc.data().end)
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching week bookings:', error);
    res.status(500).json({ message: 'Error fetching week bookings' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { uid, start, end } = req.body;
    
    if (!uid || !start || !end) {
      return res.status(400).json({ message: 'UID, start, and end are required' });
    }

    const startDateTime = new Date(start);
    const endDateTime = new Date(end);

    if (endDateTime <= startDateTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Check if user already has a booking on this day
    const startOfDay = new Date(startDateTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startDateTime);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookingsQuery = db.collection("bookings")
      .where("UID", "==", uid)
      .where("start", ">=", toFirestoreTimestamp(startOfDay))
      .where("start", "<=", toFirestoreTimestamp(endOfDay));

    const existingBookingsSnapshot = await existingBookingsQuery.get();
    if (!existingBookingsSnapshot.empty) {
      return res.status(400).json({ message: 'You already have a booking on this day' });
    }

    // Check for time slot conflicts
    const conflictQuery = db.collection("bookings")
      .where("start", "<", toFirestoreTimestamp(endDateTime))
      .where("end", ">", toFirestoreTimestamp(startDateTime));

    const conflictSnapshot = await conflictQuery.get();
    if (!conflictSnapshot.empty) {
      return res.status(400).json({ message: 'This time slot overlaps with an existing booking' });
    }

    const bookingData = {
      UID: uid,
      start: toFirestoreTimestamp(startDateTime),
      end: toFirestoreTimestamp(endDateTime)
    };

    const bookingId = `${uid}${startDateTime.toDateString()}`;
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

// Delete booking
app.delete('/api/bookings/:bookingId', async (req, res) => {
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

// Get all members
app.get('/api/admin/members', async (req, res) => {
  try {
    const membersQuery = db.collection("users").where("isMember", "==", true);
    const membersSnapshot = await membersQuery.get();
    
    const members = membersSnapshot.docs.map(doc => ({
      uid: doc.id,
      email: doc.data().email,
      eventsAttended: doc.data().eventsAttended?.length || 0
    }));

    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Error fetching members' });
  }
});

// Get past events for admin
app.get('/api/admin/events/past', async (req, res) => {
  try {
    const now = admin.firestore.Timestamp.now();
    const eventsQuery = db.collection("events")
      .where("end", "<", now)
      .orderBy("start", "desc");
    
    const eventsSnapshot = await eventsQuery.get();
    const events = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
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

// Upload attendance for an event
app.post('/api/admin/events/:eventId/attendance', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { attendeeEmails } = req.body;
    
    if (!attendeeEmails || !Array.isArray(attendeeEmails)) {
      return res.status(400).json({ message: 'Attendee emails array is required' });
    }

    // Get all users whose emails match the attendees
    const usersQuery = db.collection("users").where("email", "in", attendeeEmails);
    const usersSnapshot = await usersQuery.get();

    // Get the event details
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventData = eventDoc.data();
    const eventDate = convertTimestamp(eventData.start);

    // Prepare attendee records and user updates
    const attendees = [];
    const userUpdatePromises = [];

    usersSnapshot.docs.forEach(userDoc => {
      const userData = userDoc.data();
      attendees.push({
        uid: userDoc.id,
        email: userData.email,
        name: userData.name || userData.email
      });

      // Update user's events attended
      userUpdatePromises.push(
        db.collection("users").doc(userDoc.id).update({
          eventsAttended: admin.firestore.FieldValue.arrayUnion({
            date: eventDate,
            eventID: eventId,
            name: eventData.name
          })
        })
      );
    });

    // Update event with attendees
    await db.collection("events").doc(eventId).update({
      attendees: admin.firestore.FieldValue.arrayUnion(...attendees)
    });

    // Update all users
    await Promise.all(userUpdatePromises);

    res.json({ 
      message: 'Attendance uploaded successfully',
      attendeesCount: attendees.length
    });
  } catch (error) {
    console.error('Error uploading attendance:', error);
    res.status(500).json({ message: 'Error uploading attendance' });
  }
});

// Remove member
app.delete('/api/admin/members/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Update user in database
    await db.collection("users").doc(uid).update({
      isMember: false,
      deleted: true,
      deletedAt: admin.firestore.Timestamp.now()
    });

    // Delete user credentials
    await admin.auth().deleteUser(uid);

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Error removing member' });
  }
});

// Get all events for user creation
app.get('/api/events/all', async (req, res) => {
  try {
    const eventsQuery = db.collection("events");
    const eventsSnapshot = await eventsQuery.get();
    
    const events = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        start: convertTimestamp(data.start),
        attendees: data.attendees || [],
        registered: data.registered || []
      };
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Error fetching all events' });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { uid, email, eventsAttended, eventsRegistered } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ message: 'UID and email are required' });
    }

    const userData = {
      email: email.toLowerCase(),
      isMember: false,
      isOnMailingList: false,
      eventsAttended: eventsAttended || [],
      eventsRegistered: eventsRegistered || []
    };

    await db.collection("users").doc(uid).set(userData);
    
    res.status(201).json({ 
      message: 'User created successfully',
      uid 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update event attendees/registered
app.patch('/api/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;
    
    await db.collection("events").doc(eventId).update(updates);
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

