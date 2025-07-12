import React, { useState, useEffect } from 'react';
import { getFirestore, query, collection, where, Timestamp, orderBy, getDocs, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import '../styles/EventsPage.css';
import { useApp } from '../hooks/useApp';
import { eventCategories } from "../components/admin/CreateEvent.tsx";
import { Event, UserEventRecord } from '../types';

const EventsPage: React.FC = () => {
  const { user, isLoggedIn, navigateTo, error } = useApp();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [selectedUpcomingCategory, setSelectedUpcomingCategory] = useState<string>('All');
  const [selectedPastCategory, setSelectedPastCategory] = useState<string>('All');

  const db = getFirestore();
  
  const fetchUpcomingEvents = async () => {
    const upcomingEventsQuery = query(collection(db, "events"), where("start", ">=", Timestamp.now()), orderBy("start", "desc"));
    const upcomingEventsSnapshot = await getDocs(upcomingEventsQuery);
    const upcomingEvents: Event[] = upcomingEventsSnapshot.docs.map(doc => {
      const data = doc.data();
      const eventTitle = data.name || 'Untitled Event';
      return {
        id: doc.id,
        category: data.category || 'Other',
        name: eventTitle,
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
      const eventTitle = data.name || 'Untitled Event';
      return {
        id: doc.id,
        category: data.category || 'Other',
        name: eventTitle,
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
    if (user) {
      const fetchUserRegistrations = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const registered: Event[] = userData.eventsRegistered.map((event: UserEventRecord) => ({
            id: event.eventID,
          }));
          setRegisteredEvents(registered);
        }
      };
      fetchUserRegistrations();
    } else {
      setRegisteredEvents([]);
    }
  }, [user, db]);

  const handleRSVP = async (eventID: string) => {
    if (!isLoggedIn) {
      navigateTo('login', 'Please log in to register for events.');
      return;
    }
    try {
      const event = upcomingEvents.find(e => e.id === eventID);
      await updateDoc(doc(db, 'events', eventID), {
        registered: arrayUnion({ uid: user?.uid, email: user?.email })
      });
      if (!user?.uid) throw new Error('User ID not found');
      await updateDoc(doc(db, 'users', user.uid), {
        eventsRegistered: arrayUnion({ date: event?.date, eventID: event?.id, name: event?.name })
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
      <div className="events-page">
        <div className="events-layout">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading Events</div>
            <div className="loading-subtext">Please wait while we fetch the latest events...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-layout">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Discover and join exciting ACM events at Johns Hopkins</p>
        </div>

        {error && (
          <div className="events-section error-section">
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* Upcoming Events Section */}
        <div className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
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
                  <div className="event-header">
                    <h3 className="event-title">{event.name}</h3>
                    <span className="event-category-badge">{event.category}</span>
                    <div className="event-status"></div>
                  </div>
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
                  >
                    {isRegistered ? 'Registered' : 'RSVP'}
                  </button>
                </div>
              )})
            ))}
          </div>
        </div>

        {/* Past Events Section */}
        <div className="events-section">
          <h2 className="section-title">Past Events</h2>
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
              <div key={event.id} className="event-card past-event">
                <div className="event-header">
                  <h3 className="event-title">{event.name}</h3>
                  <span className="event-category-badge">{event.category}</span>
                  <div className="event-status"></div>
                </div>
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
      </div>
    </div>
  );
};

export default EventsPage;