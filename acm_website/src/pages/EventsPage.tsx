import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import '../styles/EventsPage.css';
import { useApp } from '../hooks/useApp';
import { eventCategories } from "../components/admin/CreateEvent.tsx";
import { Event, UserEventRecord } from '../types';
import { getUpcomingEvents, getPastEvents, rsvpForEvent, getUserData } from '../api';

const EventsPage: React.FC = () => {
  const { user, isLoggedIn, navigateTo, error } = useApp();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [selectedUpcomingCategory, setSelectedUpcomingCategory] = useState<string>('All');
  const [selectedPastCategory, setSelectedPastCategory] = useState<string>('All');

  const fetchUpcomingEvents = async () => {
    try {
      const events = await getUpcomingEvents();
      setUpcomingEvents(events);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  };

  const fetchPastEvents = async () => {
    try {
      const events = await getPastEvents();
      setPastEvents(events);
    } catch (error) {
      console.error('Error fetching past events:', error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await Promise.all([fetchUpcomingEvents(), fetchPastEvents()]);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserRegistrations = async () => {
        try {
          const userData = await getUserData(user.uid);
          const registered: Event[] = userData.eventsRegistered.map((event: UserEventRecord) => ({
            id: event.eventID,
          }));
          setRegisteredEvents(registered);
        } catch (error) {
          console.error('Error fetching user registrations:', error);
        }
      };
      fetchUserRegistrations();
    } else {
      setRegisteredEvents([]);
    }
  }, [user]);

  const handleRSVP = async (eventID: string) => {
    if (!isLoggedIn) {
      navigateTo('login', 'Please log in to register for events.');
      return;
    }
    try {
      if (!user?.uid || !user?.email) throw new Error('User ID or email not found');
      
      await rsvpForEvent(eventID, user.uid, user.email);
      
      // Refresh user registrations
      const userData = await getUserData(user.uid);
      const registered: Event[] = userData.eventsRegistered.map((event: UserEventRecord) => ({
        id: event.eventID,
      }));
      setRegisteredEvents(registered);
      
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
      <div className="page events-page">
        <div className="page-layout">
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
    <div className="page events-page">
      <div className="page-layout">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Discover and join exciting ACM events at Johns Hopkins</p>
        </div>

        {error && (
          <div className="page-section error-section">
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* Upcoming Events Section */}
        <div className="page-section">
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
        <div className="page-section">
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