import React from 'react';
import '../../styles/AdminPage.css';

interface EventItem {
  id: string;
  name: string;
  date: Date;
}

interface AttendanceUploadProps {
  pastEvents: EventItem[];
  selectedEvent: string;
  setSelectedEvent: (id: string) => void;
  setAttendanceFile: (f: File | null) => void;
  handleAttendanceUpload: (e: React.FormEvent) => void;
}

const AttendanceUpload: React.FC<AttendanceUploadProps> = ({
  pastEvents,
  selectedEvent,
  setSelectedEvent,
  setAttendanceFile,
  handleAttendanceUpload
}) => (
  <div className="login-box">
    <h2 className="admin-header">Upload Attendance</h2>
    <form onSubmit={handleAttendanceUpload} className="admin-form">
      <div>
        <label className="admin-label">Select Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          required
          className="admin-select"
        >
          <option value="">Select an event...</option>
          {pastEvents.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} ({event.date.toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="admin-label">Upload Spreadsheet</label>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setAttendanceFile(e.target.files?.[0] || null)}
          required
          className="admin-input"
        />
      </div>
      <button type="submit" className="login-button mt-10">
        Upload Attendance
      </button>
    </form>
  </div>
);

export default AttendanceUpload;
