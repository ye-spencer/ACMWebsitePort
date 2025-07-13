import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import '../styles/ProfilePage.css';
import { auth } from '../firebase/config';
import { EmailAuthProvider, updatePassword, deleteUser, signOut, reauthenticateWithCredential } from "firebase/auth";
import { useApp } from '../hooks/useApp';
import UserInfoContainer from '../components/profile/UserInfoContainer';
import EventsContainer from '../components/profile/EventsContainer';
import PasswordModal from '../components/profile/PasswordModal';
import VerifyPasswordModal from '../components/profile/VerifyPasswordModal';
import { Booking, Profile, UserEventRecord } from '../types';
import { getUserData, updateUser, getUserBookings, deleteBooking } from '../api';

type ProfileSection = 'profile' | 'bookings' | 'events';

const ProfilePage: React.FC = () => {
  const { user, navigateTo, error, authLoading } = useApp();
  const [activeSection, setActiveSection] = useState<ProfileSection>('profile');
  const [userData, setUserData] = useState<Profile | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UserEventRecord[]>([]);
  const [pastEvents, setPastEvents] = useState<UserEventRecord[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [memberError, setMemberError] = useState<string>('');
  const [memberSuccess, setMemberSuccess] = useState<string>('');
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');

  useEffect(() => {
    // Don't redirect while authentication is still loading
    if (authLoading) {
      return;
    }

    if (user) {
      const loadUserData = async () => {
        try {
          // Get user data from API
          const userData = await getUserData(user.uid);
          if (!userData) {
            navigateTo('login', 'Error loading user data');
            return;
          }
          setUserData(userData);

          // Get bookings from API
          const bookings = await getUserBookings(user.uid);
          setUpcomingBookings(bookings.filter(booking => new Date(booking.start) > new Date()));
          setPastBookings(bookings.filter(booking => new Date(booking.start) <= new Date()));

          setUpcomingEvents(userData.eventsRegistered.filter(event => new Date(event.date) > new Date()));
          setPastEvents(userData.eventsAttended.filter(event => new Date(event.date) <= new Date()));
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };
      
      loadUserData();
    } else {
      navigateTo('login', 'Please log in to access your profile');
    }
  }, [user, navigateTo, authLoading]);

  const handleVerifyPassword = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Verify current password
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // If verification successful, show password change modal
        setShowVerifyModal(false);
        setCurrentPassword('');
        setPasswordError('');
        setShowPasswordModal(true);
      }
    } catch (err) {
      console.error(err);
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    // validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // update password
        await updatePassword(user, newPassword);
        setShowPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      }
    } catch (err) {
      console.error(err);
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const user = auth.currentUser;
        if (user) {
          // Update user in database via API
          await updateUser({
            uid: user.uid,
            email: user.email!,
            isMember: false,
            isOnMailingList: false,
            eventsAttended: [],
            eventsRegistered: [],
            deleted: true,
            deletedAt: new Date(),
          });
          
          // Delete user credentials
          await deleteUser(user);
          navigateTo('home');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigateTo('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleToggleMailingList = async () => {
    try {
      const user = auth.currentUser;
      if (user && userData) {
        await updateUser({ ...userData, isOnMailingList: !userData.isOnMailingList });
        setUserData({ ...userData, isOnMailingList: !userData.isOnMailingList });
      }
    } catch (error) {
      console.error('Error joining mailing list:', error);
    }
  };

  const handleBecomeMember = async () => {
    setMemberError('');
    setMemberSuccess('');

    // check if user satisfies requirements
    if (userData?.eventsAttended.length ?? 0 < 3) {
      setMemberError('You must have attended at least 3 events to become a member.');
      return;
    }

    // update user in database
    try {
      if (userData) {
        await updateUser({ ...userData, isMember: true });
        setUserData({ ...userData, isMember: true });
        setMemberSuccess('You are now a member!');
      }
    } catch (error) {
      console.error('Error updating membership:', error);
      setMemberError('Failed to update membership status. Please try again.');
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour12: true
    });
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await deleteBooking(bookingId);
        setUpcomingBookings(prev => prev.filter(booking => booking.id !== bookingId));
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const renderContent = () => {
    if (!userData) {
      return null;
    }

    switch (activeSection) {
      case 'profile':
        return (
          <UserInfoContainer
            userData={userData}
            memberError={memberError}
            memberSuccess={memberSuccess}
            onBecomeMember={handleBecomeMember}
            onToggleMailingList={handleToggleMailingList}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            onChangePassword={() => setShowVerifyModal(true)}
          />
        );
      case 'bookings':
        return (
          <EventsContainer
            title="Your Bookings"
            upcomingTitle="Upcoming Bookings"
            pastTitle="Past Bookings"
            upcomingItems={upcomingBookings}
            pastItems={pastBookings}
            renderUpcomingItem={(booking) => (
              <div className="profile-booking-item upcoming" key={booking.id}>
                <span>
                  {formatDate(booking.start)} • {formatTime(booking.start)} - {formatTime(booking.end)}
                </span>
                <button className="delete-icon" onClick={() => handleDeleteBooking(booking.id)}>
                  ×
                </button>
              </div>
            )}
            renderPastItem={(booking) => (
              <div className="profile-booking-item" key={booking.id}>
                {formatDate(booking.start)} • {formatTime(booking.start)} - {formatTime(booking.end)}
              </div>
            )}
          />
        );
      case 'events':
        return (
          <EventsContainer
            title="Your Events"
            upcomingTitle="Upcoming Events"
            pastTitle="Past Events"
            upcomingItems={upcomingEvents}
            pastItems={pastEvents}
            renderUpcomingItem={(event, index) => (
              <div className="profile-event-item" key={`${event.eventID}-${index}`}>
                <h4 className="profile-event-title">{event.name}</h4>
                <p className="profile-event-date">
                  {formatDate(event.date)} • {formatTime(event.date)}
                </p>
              </div>
            )}
            renderPastItem={(event, index) => (
              <div className="profile-event-item" key={`${event.eventID}-${index}`}>
                <h4 className="profile-event-title">{event.name}</h4>
                <p className="profile-event-date">
                  {formatDate(event.date)} • {formatTime(event.date)}
                </p>
              </div>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="page profile-page">
      <div className="profile-layout">
        {error && <div className="error-message">{error}</div>}

        {/* Left Sidebar Navigation */}
        <div className="profile-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Profile</h2>
            <p className="sidebar-subtitle">Manage your account</p>
          </div>
          
          <nav className="sidebar-nav">
            <button
              className={`sidebar-nav-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Account</span>
            </button>
            
            <button
              className={`sidebar-nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveSection('bookings')}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-text">Bookings</span>
              {upcomingBookings.length > 0 && (
                <span className="nav-badge">{upcomingBookings.length}</span>
              )}
            </button>
            
            <button
              className={`sidebar-nav-item ${activeSection === 'events' ? 'active' : ''}`}
              onClick={() => setActiveSection('events')}
            >
              <span className="nav-icon">🎉</span>
              <span className="nav-text">Events</span>
              {upcomingEvents.length > 0 && (
                <span className="nav-badge">{upcomingEvents.length}</span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="profile-content">
          {renderContent()}
        </div>
      </div>

      <VerifyPasswordModal
        show={showVerifyModal}
        currentPassword={currentPassword}
        passwordError={passwordError}
        onClose={() => {
          setShowVerifyModal(false);
          setCurrentPassword('');
          setPasswordError('');
        }}
        onCurrentPasswordChange={setCurrentPassword}
        onSubmit={handleVerifyPassword}
      />

      <PasswordModal
        show={showPasswordModal}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        passwordError={passwordError}
        onClose={() => {
          setShowPasswordModal(false);
          setNewPassword('');
          setConfirmPassword('');
          setPasswordError('');
        }}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
};

export default ProfilePage;
