import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import '../styles/AdminPage.css';
import CreateEvent from '../components/admin/CreateEvent';
import Members from '../components/admin/Members';
import AttendanceUpload from '../components/admin/AttendanceUpload';
import Account from '../components/admin/Account';
import { auth } from '../firebase/config';
import { signOut } from "firebase/auth";
import { useApp } from '../hooks/useApp';
import * as XLSX from 'xlsx';
import { getMembers, getPastEventsForAdmin, createEvent, uploadAttendance, removeMember } from '../api';
import { Event, EventSummary, Member, SpreadsheetRow } from '../types';

type AdminSection = 'dashboard' | 'create-event' | 'members' | 'attendance';

const AdminPage: React.FC = () => {
  const { user, isAdmin, navigateTo, error, authLoading, setError } = useApp();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [pastEvents, setPastEvents] = useState<EventSummary[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  // Event form state
  const [eventCategory, setEventCategory] = useState<string>('');
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
    // Don't redirect while authentication is still loading or during logout
    if (authLoading || isLoggingOut) {
      return;
    }
    if (!isAdmin && user) {
      navigateTo('profile', 'You do not have permission to access the admin page');
      return;
    } else if (!user) {
      navigateTo('login', 'Please log in to access the admin page');
      return;
    }

    const fetchAdminData = async () => {
      try {
        // Fetch members
        const membersData = await getMembers();
        setMembers(membersData);

        // Fetch past events
        const events = await getPastEventsForAdmin();
        setPastEvents(events);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to fetch admin data');
      }
    };

    fetchAdminData();
  }, [user, isAdmin, navigateTo, authLoading, isLoggingOut, setError]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // get start and end date and time
      const startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
      const endDateTime = new Date(`${eventEndDate}T${eventEndTime}`);

      // validate start and end date and time
      if (endDateTime <= startDateTime) {
        setError('End time must be after start time');
        return;
      }

      // send event to database
      await createEvent({
        id: '',
        category: eventCategory,
        name: eventTitle,
        description: eventDescription,
        location: eventLocation,
        link: eventLink,
        attendees: [],
        registered: [],
        start: startDateTime,
        end: endDateTime
      } as Event);

      // Reset form
      setEventCategory('');
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
      setError('Failed to create event. Please try again.');
    }
  };

  const handleRemoveMember = async (uid: string) => {
    // confirm removal
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        // Remove member using API
        await removeMember(uid);

        // remove user from members list
        setMembers(prev => prev.filter(member => member.uid !== uid));
      } catch (error) {
        console.error('Error removing member:', error);
        setError('Failed to remove member. Please try again.');
      }
    }
  };

  const handleAttendanceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate event and file
    if (!selectedEvent || !attendanceFile) {
      setError('Please select an event and upload a file');
      return;
    }

    try {
      // Read the spreadsheet file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<SpreadsheetRow>(firstSheet);

          // Extract emails from the spreadsheet
          // Assuming the email column is named 'Email' or 'email'
          const attendeeEmails = jsonData
            .map(row => row.Email || row.email)
            .filter((email): email is string => typeof email === 'string' && email.length > 0)
            .map(email => email.toLowerCase().trim());

          if (attendeeEmails.length === 0) {
            throw new Error('No valid emails found in the spreadsheet');
          }

          // Upload attendance using API
          await uploadAttendance(selectedEvent, attendeeEmails);

          alert(`Attendance uploaded successfully for ${attendeeEmails.length} attendees!`);
          
          // Reset form
          setSelectedEvent('');
          setAttendanceFile(null);
        } catch (error) {
          console.error('Error processing attendance file:', error);
          setError('Failed to process attendance file. Please try again.');
        }
      };

      reader.readAsArrayBuffer(attendanceFile);
    } catch (error) {
      console.error('Error uploading attendance:', error);
      setError('Failed to upload attendance. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      navigateTo('login', 'You have been logged out');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to log out. Please try again.');
      setIsLoggingOut(false); // Reset on error
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="page-section admin-section">
            <h2 className="section-title">Dashboard Overview</h2>
            <div className="dashboard-stats">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">👥</div>
                <div className="admin-stat-content">
                  <div className="admin-stat-number">{members.length}</div>
                  <div className="admin-stat-label">Total Members</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">📅</div>
                <div className="admin-stat-content">
                  <div className="admin-stat-number">{pastEvents.length}</div>
                  <div className="admin-stat-label">Past Events</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">🎯</div>
                <div className="admin-stat-content">
                  <div className="admin-stat-number">
                    {members.length > 0 
                      ? Math.round(members.reduce((sum, member) => sum + member.eventsAttended, 0) / members.length * 10) / 10
                      : 0
                    }
                  </div>
                  <div className="admin-stat-label">Avg Events/Member</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'create-event':
        return (
          <div className="page-section admin-section">
            <CreateEvent
              eventCategory={eventCategory}
              setEventCategory={setEventCategory}
              eventTitle={eventTitle}
              setEventTitle={setEventTitle}
              eventDescription={eventDescription}
              setEventDescription={setEventDescription}
              eventLocation={eventLocation}
              setEventLocation={setEventLocation}
              eventLink={eventLink}
              setEventLink={setEventLink}
              eventStartDate={eventStartDate}
              setEventStartDate={setEventStartDate}
              eventStartTime={eventStartTime}
              setEventStartTime={setEventStartTime}
              eventEndDate={eventEndDate}
              setEventEndDate={setEventEndDate}
              eventEndTime={eventEndTime}
              setEventEndTime={setEventEndTime}
              handleCreateEvent={handleCreateEvent}
            />
          </div>
        );
      case 'members':
        return (
          <div className="page-section admin-section">
            <Members
              members={members}
              handleRemoveMember={handleRemoveMember}
            />
          </div>
        );
      case 'attendance':
        return (
          <div className="page-section admin-section">
            <AttendanceUpload
              pastEvents={pastEvents}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
              setAttendanceFile={setAttendanceFile}
              handleAttendanceUpload={handleAttendanceUpload}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="page admin-page">
      <div className="admin-layout">
        {error && <div className="error-message">{error}</div>}

        {/* Left Sidebar Navigation */}
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Admin Panel</h2>
            <p className="sidebar-subtitle">Manage your organization</p>
          </div>
          
          <nav className="sidebar-nav">
            <button
              className={`sidebar-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </button>
            
            <button
              className={`sidebar-nav-item ${activeSection === 'create-event' ? 'active' : ''}`}
              onClick={() => setActiveSection('create-event')}
            >
              <span className="nav-icon">➕</span>
              <span className="nav-text">Create Event</span>
            </button>
            
            <button
              className={`sidebar-nav-item ${activeSection === 'members' ? 'active' : ''}`}
              onClick={() => setActiveSection('members')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">Members</span>
              <span className="nav-badge">{members.length}</span>
            </button>
            
            <button
              className={`sidebar-nav-item ${activeSection === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveSection('attendance')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Attendance</span>
              {pastEvents.length > 0 && (
                <span className="nav-badge">{pastEvents.length}</span>
              )}
            </button>
          </nav>

          {/* Account Section at Bottom */}
          <div className="sidebar-account">
            <div className="account-divider"></div>
            <Account handleLogout={handleLogout} />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 