import React, { useState, useEffect } from 'react';
import { getFirestore, query, collection, where, Timestamp, orderBy, getDocs, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import '../styles/EventsPage.css';
import '../styles/NavBar.css';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";

interface EventsPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
}

const EventsPage: React.FC<EventsPageProps> = ({ navigateTo, error }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);

  const db = getFirestore();
  
  const fetchUpcomingEvents = async () => {
    const upcomingEventsQuery = query(collection(db, "events"), where("start", ">=", Timestamp.now()), orderBy("start", "desc"));
    const upcomingEventsSnapshot = await getDocs(upcomingEventsQuery);
    const upcomingEvents: Event[] = upcomingEventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.name || 'Untitled Event',
        date: data.start.toDate(),
        start_time: data.start ? data.start.toDate().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : 'TBD',
        end_time: data.end ? data.end.toDate().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : 'TBD',
        location: data.location || 'TBD',
        description: data.description || '',
      };
    });
    setUpcomingEvents(upcomingEvents);
  }

  const fetchPastEvents = async () => {
    const pastEventsQuery = query(collection(db, "events"), where("start", "<", Timestamp.now()), orderBy("start", "desc"));
    const pastEventsSnapshot = await getDocs(pastEventsQuery);
    const pastEvents: Event[] = pastEventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.name || 'Untitled Event',
        date: data.start.toDate(),
        start_time: data.start ? data.start.toDate().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : 'TBD',
        end_time: data.end ? data.end.toDate().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : 'TBD',
        location: data.location || 'TBD',
        description: data.description || '',
      };
    });
    setPastEvents(pastEvents);
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await fetchUpcomingEvents();
        await fetchPastEvents();
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [db]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);
      setIsAdmin(user?.email === "jhuacmweb@gmail.com");
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const registered: Event[] = userData.eventsRegistered.map((event: any) => ({
            id: event.eventID,
          }));
          setRegisteredEvents(registered);
        }
      } else setRegisteredEvents([]);
    });
  }, [db]);

  const handleRSVP = async (eventID: string) => {
    if (!isLoggedIn) {
      navigateTo('login', 'Please log in to register for events.');
      return;
    }
    try {
      const user = auth.currentUser;
      const event = upcomingEvents.find(e => e.id === eventID);
      await updateDoc(doc(db, 'events', eventID), {
        registered: arrayUnion({ uid: user?.uid, email: user?.email })
      });
      if (!user?.uid) throw new Error('User ID not found');
      await updateDoc(doc(db, 'users', user.uid), {
        eventsRegistered: arrayUnion({ date: event?.date, eventID: event?.id, title: event?.title })
      });
      alert('Successfully registered for the event!');
    } catch (error) {
      alert('Error registering for event.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="about-background" style={{ zIndex: -1 }}></div>
        <h1 className="events-title">Loading Events...</h1>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="about-background" style={{ zIndex: -1 }}></div>

      <div className="navbar">
        <button className="nav-links" onClick={() => navigateTo('about')}>About Us</button>
        <button className="nav-links" onClick={() => navigateTo('events')}>Events</button>
        <button className="nav-links" onClick={() => navigateTo('booking')}>Book Lounge</button>
        <button className="nav-links" onClick={() => navigateTo(isAdmin ? 'admin' : isLoggedIn ? 'profile' : 'login')}>
          {isAdmin ? 'Admin' : isLoggedIn ? 'Profile' : 'Login'}
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ position: 'relative', zIndex: 2 }}>
          {error}
        </div>
      )}

      {/*Upcoming Events */}
      <h1 className="events-title">Upcoming Events</h1>
      <div className="events-list">
        {upcomingEvents.length === 0 ? (
          <div className="no-events-message">
            <p>No upcoming events at the moment.</p>
            <p>Check back soon for new events!</p>
          </div>
        ) : (
          upcomingEvents.map(event => {
            const isRegistered = registeredEvents.some(e => e.id == event.id);
            return (
              <div key={event.id} className="event-card">
                <h2 className="event-title">{event.title}</h2>
                <div className="event-details">
                  <p><strong>Date:</strong> {event.date.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {event.start_time} - {event.end_time}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                </div>
                <p className="event-description">{event.description}</p>
                <button
                  className="event-button"
                  onClick={() => handleRSVP(event.id)}
                  disabled={isRegistered}
                  style={isRegistered ? { background: '#aaa', color: '#fff', cursor: 'not-allowed' } : {}}
                >
                  {isRegistered ? 'Registered' : 'RSVP'}
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Past Events */}
      <h1 className="events-title">Past Events</h1>
      <div className="events-list">
        {pastEvents.map(event => (
          <div key={event.id} className="event-card" style={{ backgroundColor: 'rgba(220, 220, 220, 0.8)' }}>
            <h2 className="event-title">{event.title}</h2>
            <div className="event-details">
              <p><strong>Date:</strong> {event.date.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.start_time} - {event.end_time}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
            <p className="event-description">{event.description}</p>
          </div>
        ))}
      </div>
      <button className="home-button" onClick={() => navigateTo('home')} style={{ position: 'relative', zIndex: 2 }}>Back to Home</button>
      
      <div className="credits" onClick={() => navigateTo('credits')}>
        Made with lots of ❤️ by JHU ACM
      </div>
    </div>
  );
};

export default EventsPage;