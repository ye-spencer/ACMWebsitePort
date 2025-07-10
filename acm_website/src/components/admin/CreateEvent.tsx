import React from 'react';
import '../../styles/AdminPage.css';

interface CreateEventProps {
  eventTitle: string;
  setEventTitle: (v: string) => void;
  eventDescription: string;
  setEventDescription: (v: string) => void;
  eventLocation: string;
  setEventLocation: (v: string) => void;
  eventLink: string;
  setEventLink: (v: string) => void;
  eventStartDate: string;
  setEventStartDate: (v: string) => void;
  eventStartTime: string;
  setEventStartTime: (v: string) => void;
  eventEndDate: string;
  setEventEndDate: (v: string) => void;
  eventEndTime: string;
  setEventEndTime: (v: string) => void;
  handleCreateEvent: (e: React.FormEvent) => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({
  eventTitle,
  setEventTitle,
  eventDescription,
  setEventDescription,
  eventLocation,
  setEventLocation,
  eventLink,
  setEventLink,
  eventStartDate,
  setEventStartDate,
  eventStartTime,
  setEventStartTime,
  eventEndDate,
  setEventEndDate,
  eventEndTime,
  setEventEndTime,
  handleCreateEvent
}) => (
  <>
    <h2 className="admin-header">Create New Event</h2>
    <form onSubmit={handleCreateEvent} className="admin-form">
      <input
        type="text"
        placeholder="Event Title"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
        required
        className="admin-input"
      />
      <textarea
        placeholder="Event Description"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        required
        className="admin-textarea"
      />
      <input
        type="text"
        placeholder="Location"
        value={eventLocation}
        onChange={(e) => setEventLocation(e.target.value)}
        required
        className="admin-input"
      />
      <input
        type="url"
        placeholder="Event Link (optional)"
        value={eventLink}
        onChange={(e) => setEventLink(e.target.value)}
        className="admin-input"
      />
      <div className="admin-grid2">
        <div>
          <label className="admin-label">Start Date</label>
          <input
            type="date"
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
            required
            className="admin-datetime"
          />
        </div>
        <div>
          <label className="admin-label">Start Time</label>
          <input
            type="time"
            value={eventStartTime}
            onChange={(e) => setEventStartTime(e.target.value)}
            required
            className="admin-datetime"
          />
        </div>
      </div>
      <div className="admin-grid2">
        <div>
          <label className="admin-label">End Date</label>
          <input
            type="date"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
            required
            className="admin-datetime"
          />
        </div>
        <div>
          <label className="admin-label">End Time</label>
          <input
            type="time"
            value={eventEndTime}
            onChange={(e) => setEventEndTime(e.target.value)}
            required
            className="admin-datetime"
          />
        </div>
      </div>
      <button type="submit" className="admin-btn primary w-full mt-10">Create Event</button>
    </form>
  </>
);

export default CreateEvent;
