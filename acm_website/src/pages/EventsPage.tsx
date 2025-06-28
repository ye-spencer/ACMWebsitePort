import React, { useState, useEffect } from 'react';
import { getFirestore, query, collection, where, Timestamp, orderBy, getDocs } from 'firebase/firestore';

interface EventsPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
}

const EventsPage: React.FC<EventsPageProps> = ({ navigateTo, error }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch current events
        const eventsQuery = query(collection(db, "events"), where("start", ">=", Timestamp.now()), orderBy("start", "desc"));
        const eventsSnapshot = await getDocs(eventsQuery);
        const currentEvents: Event[] = eventsSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.name || 'Untitled Event',
              date: data.start ? data.start.toDate().toLocaleDateString() : 'TDB',
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
        setEvents(currentEvents);

        // Fetch past events
        const pastEventsQuery = query(collection(db, "events"), where("start", "<", Timestamp.now()), orderBy("start", "desc"));
        const pastEventsSnapshot = await getDocs(pastEventsQuery);
        const pastEventsData: Event[] = pastEventsSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.name || 'Untitled Event',
              date: data.start ? data.start.toDate().toLocaleDateString() : 'TDB',
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
        setPastEvents(pastEventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [db]);

  if (loading) {
    return (
      <div className="events-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="about-background" style={{ zIndex: -1 }}></div>
        <h1 className="events-title" style={{ position: 'relative', zIndex: 2, color: 'white' }}>Loading Events...</h1>
      </div>
    );
  }

  return (
    <div className="events-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="about-background" style={{ zIndex: -1 }}></div>
      {error && (
        <div className="error-message" style={{ position: 'relative', zIndex: 2 }}>
          {error}
        </div>
      )}
      <h1 className="events-title" style={{ position: 'relative', zIndex: 2, color: 'white' }}>Upcoming Events</h1>
      <div className="events-list" style={{ position: 'relative', zIndex: 2 }}>
        {events.length === 0 ? (
          <div className="no-events-message" style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: 'white', 
            fontSize: '1.2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <p>No upcoming events at the moment.</p>
            <p>Check back soon for new events!</p>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="event-card" style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="event-title">{event.title}</h2>
              <div className="event-details">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.start_time} - {event.end_time}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
              <p className="event-description">{event.description}</p>
              <button className="event-button">RSVP</button>
            </div>
          ))
        )}
      </div>

      {/* Past Events */}
      <h1 className="events-title" style={{ position: 'relative', zIndex: 2, color: 'white' }}>Past Events</h1>
      <div className="events-list" style={{ position: 'relative', zIndex: 2 }}>
        {pastEvents.map(event => (
          <div key={event.id} className="event-card" style={{ position: 'relative', zIndex: 2, backgroundColor: 'rgba(220, 220, 220, 0.8)' }}>
            <h2 className="event-title">{event.title}</h2>
            <div className="event-details">
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.start_time} - {event.end_time}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
            <p className="event-description">{event.description}</p>
          </div>
        ))}
      </div>
      <button className="home-button" onClick={() => navigateTo('home')} style={{ position: 'relative', zIndex: 2 }}>Back to Home</button>
      
      <div 
        onClick={() => navigateTo('credits')}
        style={{ 
          fontSize: '0.8rem', 
          textAlign: 'center', 
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          color: 'white',
          opacity: 0.8,
          cursor: 'pointer',
          backgroundColor: 'rgba(50, 50, 50, 0.5)',
          padding: '8px 0',
          backdropFilter: 'blur(2px)',
          zIndex: 2
        }}
      >
        Made with lots of ❤️ by JHU ACM
      </div>
    </div>
  );
};

export default EventsPage;