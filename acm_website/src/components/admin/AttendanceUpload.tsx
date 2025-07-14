import React from 'react';
import '../../styles/AdminPage.css';
import { EventSummary } from '../../types';

interface AttendanceUploadProps {
  pastEvents: EventSummary[];
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
  <>
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
              {event.name} ({new Date(event.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="admin-label">Upload Spreadsheet</label>
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setAttendanceFile(e.target.files?.[0] || null)}
            required
            className="file-input"
            id="attendance-file"
          />
          <label htmlFor="attendance-file" className="file-input-label">
            📄 Choose spreadsheet file (.csv, .xlsx, .xls)
          </label>
        </div>
      </div>
      <button type="submit" className="admin-btn primary w-full mt-10">
        Upload Attendance
      </button>
    </form>
  </>
);

export default AttendanceUpload;
