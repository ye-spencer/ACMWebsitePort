import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getFirestore, getDocs, query, where, updateDoc, addDoc, Timestamp, orderBy } from "firebase/firestore";

interface AdminPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  link: string;
  start: Date;
  end: Date;
}

interface Member {
  uid: string;
  email: string;
  eventsAttended: number;
}

const AdminPage: React.FC<AdminPageProps> = ({ navigateTo, error }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  
  // Event form state
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventLocation, setEventLocation] = useState<string>('');
  const [eventLink, setEventLink] = useState<string>('');
  const [eventStartDate, setEventStartDate] = useState<string>('');
  const [eventStartTime, setEventStartTime] = useState<string>('');
  const [eventEndDate, setEventEndDate] = useState<string>('');
  const [eventEndTime, setEventEndTime] = useState<string>('');
  
  // Attendance upload state
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [attendanceFile, setAttendanceFile] = useState<File | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email !== "jhuacmweb@gmail.com") {
          navigateTo('home', 'You do not have permission to access the admin page');
          return;
        }
        setIsAdmin(true);
        const db = getFirestore();

        // Fetch members
        const membersQuery = query(collection(db, "users"), where("isMember", "==", true));
        const membersSnapshot = await getDocs(membersQuery);
        const membersData: Member[] = membersSnapshot.docs.map(doc => ({
          uid: doc.id,
          email: doc.data().email,
          eventsAttended: doc.data().eventsAttended?.length || 0
        }));
        setMembers(membersData);

        // Fetch past events
        const eventsQuery = query(collection(db, "events"), where("end", "<", Timestamp.now()), orderBy("start", "desc"));
        const eventsSnapshot = await getDocs(eventsQuery);
        const events: Event[] = eventsSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              description: data.description,
              location: data.location,
              link: data.link,
              start: data.start.toDate(),
              end: data.end.toDate()
            };
          });
        setPastEvents(events);
      } else {
        navigateTo('login', 'Please log in to access the admin page');
      }
    });
  }, [navigateTo]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
      const endDateTime = new Date(`${eventEndDate}T${eventEndTime}`);

      if (endDateTime <= startDateTime) {
        alert('End time must be after start time');
        return;
      }

      await addDoc(collection(db, "events"), {
        name: eventTitle,
        description: eventDescription,
        location: eventLocation,
        link: eventLink,
        start: Timestamp.fromDate(startDateTime),
        end: Timestamp.fromDate(endDateTime),
      });

      // Reset form
      setEventTitle('');
      setEventDescription('');
      setEventLocation('');
      setEventLink('');
      setEventStartDate('');
      setEventStartTime('');
      setEventEndDate('');
      setEventEndTime('');

      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleRemoveMember = async (uid: string) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const db = getFirestore();
        await updateDoc(doc(db, "users", uid), {
          isMember: false
        });
        setMembers(prev => prev.filter(member => member.uid !== uid));
      } catch (error) {
        console.error('Error removing member:', error);
        alert('Failed to remove member. Please try again.');
      }
    }
  };

  const handleAttendanceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !attendanceFile) {
      alert('Please select an event and upload a file');
      return;
    }

    // TODO: Implement attendance upload logic
    // This would involve:
    // 1. Reading the spreadsheet file
    // 2. Parsing the attendance data
    // 3. Updating the eventsAttended field for each user
    alert('Attendance upload functionality to be implemented');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="login-page">
      <div className="about-background" style={{ zIndex: -1 }}></div>
      <div className="login-container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        maxWidth: '800px',
        width: '90%',
        margin: '20px auto',
        padding: '20px'
      }}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Create Event Container */}
        <div className="login-box" style={{ 
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#495057', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
            Create New Event
          </h2>
          <form onSubmit={handleCreateEvent} style={{ display: 'grid', gap: '15px' }}>
            <input
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                fontSize: '1rem'
              }}
            />
            <textarea
              placeholder="Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
            <input
              type="text"
              placeholder="Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                fontSize: '1rem'
              }}
            />
            <input
              type="url"
              placeholder="Event Link (optional)"
              value={eventLink}
              onChange={(e) => setEventLink(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                fontSize: '1rem'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>Start Date</label>
                <input
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  required
                  style={{
                    padding: '2px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>Start Time</label>
                <input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  required
                  style={{
                    padding: '2px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>End Date</label>
                <input
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  required
                  style={{
                    padding: '2px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>End Time</label>
                <input
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  required
                  style={{
                    padding: '2px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="login-button"
              style={{ marginTop: '10px' }}
            >
              Create Event
            </button>
          </form>
        </div>

        {/* Members Container */}
        <div className="login-box" style={{ 
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#495057', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
            Members
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#495057' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#495057' }}>Events Attended</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#495057' }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.uid} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', color: '#495057' }}>{member.email}</td>
                    <td style={{ padding: '12px', color: '#495057' }}>{member.eventsAttended}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveMember(member.uid)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                          padding: '0 5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          transition: 'background-color 0.2s',
                          margin: '0 auto'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Upload Container */}
        <div className="login-box" style={{ 
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#495057', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
            Upload Attendance
          </h2>
          <form onSubmit={handleAttendanceUpload} style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>Select Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                required
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '1rem',
                  width: '100%',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select an event...</option>
                {pastEvents.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title} ({event.start.toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>Upload Spreadsheet</label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setAttendanceFile(e.target.files?.[0] || null)}
                required
                style={{
                  padding: '8px',
                  fontSize: '1rem',
                  width: '100%'
                }}
              />
            </div>
            <button 
              type="submit"
              className="login-button"
              style={{ marginTop: '10px' }}
            >
              Upload Attendance
            </button>
          </form>
        </div>
      </div>

      <button 
        className="home-button" 
        onClick={() => navigateTo('home')}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default AdminPage; 