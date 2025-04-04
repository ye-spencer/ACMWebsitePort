import React from 'react';

interface EventsPageProps {
  navigateTo: (page: string) => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ navigateTo }) => {
  // Sample events data - in a real app, this would come from an API or database
  const events = [
    {
      id: 1,
      title: "Intro to Machine Learning Workshop",
      date: "October 15, 2023",
      time: "3:00 PM - 5:00 PM",
      location: "Computer Science Building, Room 105",
      description: "Learn the basics of machine learning algorithms and how to implement them."
    },
    {
      id: 2,
      title: "Hackathon Prep Session",
      date: "October 22, 2023",
      time: "4:00 PM - 6:00 PM",
      location: "Student Union, Room 302",
      description: "Get ready for the upcoming hackathon with tips, tricks, and team formation."
    },
    {
      id: 3,
      title: "Tech Industry Panel",
      date: "November 5, 2023",
      time: "5:30 PM - 7:30 PM",
      location: "Virtual (Zoom)",
      description: "Join us for a Q&A session with professionals from leading tech companies."
    }
  ];

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Events</h1>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h2 className="event-title">{event.title}</h2>
            <div className="event-details">
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
            <p className="event-description">{event.description}</p>
            <button className="event-button">RSVP</button>
          </div>
        ))}
      </div>
      <button className="home-button" onClick={() => navigateTo('home')}>Back to Home</button>
      
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
          backdropFilter: 'blur(2px)'
        }}
      >
        made with lots of ❤️ @JHU ACM
      </div>
    </div>
  );
};

export default EventsPage; 