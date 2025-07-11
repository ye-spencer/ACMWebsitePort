import React, { useState, useEffect } from 'react';
import { getFirestore, query, collection, where, Timestamp, orderBy, getDocs, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import '../styles/EventsPage.css';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";
import { eventCategories } from "../components/admin/CreateEvent.tsx";

interface EventsPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

interface Event {
  id: string;
  category: string;
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
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [selectedUpcomingCategory, setSelectedUpcomingCategory] = useState<string>('All');
  const [selectedPastCategory, setSelectedPastCategory] = useState<string>('All');

  const db = getFirestore();
  
  const fetchUpcomingEvents = async () => {
    const upcomingEventsQuery = query(collection(db, "events"), where("start", ">=", Timestamp.now()), orderBy("start", "desc"));
    const upcomingEventsSnapshot = await getDocs(upcomingEventsQuery);
    const upcomingEvents: Event[] = upcomingEventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        category: data.category || 'Other',
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
        category: data.category || 'Other',
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

  const filteredUpcoming = selectedUpcomingCategory == 'All' ? upcomingEvents : upcomingEvents.filter(event => event.category == selectedUpcomingCategory);
  const filteredPast = selectedPastCategory == 'All' ? pastEvents : pastEvents.filter(event => event.category == selectedPastCategory);

  if (loading) {
    return (
      <div className="events-container">
        <h1 className="events-title">Loading Events...</h1>
      </div>
    );
  }

  return (
    <div className="events-container">
      {error && (
        <div className="error-message" style={{ position: 'relative', zIndex: 2 }}>
          {error}
        </div>
      )}

      {/*Upcoming Events */}
      <h1 className="events-title">Upcoming Events</h1>
      <div className="filter-container">
        <div className="filter">
          <label className="filter-label">Category</label>
          <select
            value={selectedUpcomingCategory}
            onChange={(e) => setSelectedUpcomingCategory(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            {eventCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="events-list">
        {upcomingEvents.length == 0 ? (
          <div className="no-events-message">
            <p>No upcoming events at the moment.</p>
            <p>Check back soon for new events!</p>
          </div>
        ) : ( filteredUpcoming.length == 0 ? (
          <div className="no-events-message">
            <p>No events match the current filter.</p>
            <p>Try modifying your search.</p>
          </div>
        ) : ( filteredUpcoming.map(event => {
          const isRegistered = registeredEvents.some(e => e.id == event.id);
          return (
            <div key={event.id} className="event-card">
              <span className="event-category-badge">{event.category}</span>
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
          )})
        ))}
      </div>

      {/* Past Events */}
      <h1 className="events-title">Past Events</h1>
      <div className="filter-container">
        <div className="filter">
          <label className="filter-label">Category</label>
          <select
            value={selectedPastCategory}
            onChange={(e) => setSelectedPastCategory(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            {eventCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="events-list">
        {filteredPast.length == 0 ? (
          <div className="no-events-message">
            <p>No events match the current filter.</p>
            <p>Try modifying your search.</p>
          </div>
        ) : ( filteredPast.map(event => (
          <div key={event.id} className="event-card" style={{ backgroundColor: 'rgba(220, 220, 220, 0.8)' }}>
            <span className="event-category-badge">{event.category}</span>
            <h2 className="event-title">{event.title}</h2>
            <div className="event-details">
              <p><strong>Date:</strong> {event.date.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.start_time} - {event.end_time}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
            <p className="event-description">{event.description}</p>
          </div>
        )))}
      </div>
    </div>
  );
};

export default EventsPage;