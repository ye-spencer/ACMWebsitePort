import React, { useState, useEffect } from 'react';
import './LoginPage.css'; // Reuse the login page styling
import { auth } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";

interface BookingPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ navigateTo, error }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [dates, setDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Initial auth check
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
    } else {
      navigateTo('login', 'Please log in to access the booking page');
    }
  });

  // Generate time slots for dropdowns
  useEffect(() => {
    const slots: TimeSlot[] = [];
    // Start time slots (12 AM to 11:30 PM)
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        slots.push({
          hour,
          minute,
          label: time.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          })
        });
      }
    }
    setTimeSlots(slots);
  }, []);

  // Generate next 7 days
  useEffect(() => {
    const nextSevenDays: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextSevenDays.push(date);
    }
    setDates(nextSevenDays);
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    setSelectedDate(dates[selectedIndex]);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(e.target.value);
  };

  return (
    <div className="login-page">
      <div className="about-background" style={{ zIndex: -1 }}></div>
      <div className="login-container">
        <div className="login-box" style={{ width: '80vw', maxWidth: '1200px' }}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 0.8 }}>
              <h2 style={{ marginBottom: '10px', color: '#333' }}>Select Date and Time</h2>
              {/* date selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select 
                  value={dates.indexOf(selectedDate)} 
                  onChange={handleDateChange}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                >
                  {dates.map((date, index) => (
                    <option key={index} value={index}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>

                {/* start time selection */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={startTime} 
                    onChange={handleStartTimeChange}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da',
                      fontSize: '1rem'
                    }}
                  >
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={`${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`}>
                        {slot.label}
                      </option>
                    ))}
                  </select>

                  {/* end time selection */}
                  <select 
                    value={endTime} 
                    onChange={handleEndTimeChange}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da',
                      fontSize: '1rem'
                    }}
                  >
                    {timeSlots.map((slot, index) => {
                      // For end time, we want to show times from 12:30 AM to 12:00 AM
                      const nextSlot = timeSlots[(index + 1) % timeSlots.length];
                      const displayTime = nextSlot ? 
                        `${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}` :
                        '24:00';
                      return (
                        <option key={index} value={displayTime}>
                          {slot.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* calendar view */}
            <div style={{ flex: 2.2 }}>
              <h2 style={{ marginBottom: '10px', color: '#333' }}>Calendar View</h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto repeat(7, 1fr)', // Added auto column for time labels
                gap: '2px',
                backgroundColor: '#e9ecef',
                padding: '2px',
                borderRadius: '4px'
              }}>
                {/* Time labels column */}
                <div style={{ 
                  backgroundColor: '#fff',
                  padding: '5px 2px 5px 2px',
                  borderTopLeftRadius: '4px',
                  borderBottomLeftRadius: '4px'
                }}>
                  <div style={{ 
                    height: '30px',
                    marginBottom: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Time
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateRows: 'repeat(24, 30px)',
                    gap: '2px'
                  }}>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const time = new Date();
                      time.setHours(hour, 0, 0, 0);
                      return (
                        <div 
                          key={hour}
                          style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '8px',
                            color: '#495057',
                            height: '30px',
                            marginBottom: '1px'
                          }}
                        >
                          {time.toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            hour12: true 
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar columns */}
                {dates.map((date, dayIndex) => (
                  <div key={dayIndex} style={{ textAlign: 'center', padding: '5px', backgroundColor: '#fff' }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '5px',
                      color: date.toDateString() === new Date().toDateString() ? '#007bff' : '#333',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {formatDate(date)}
                    </div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateRows: 'repeat(48, 15px)',
                      gap: '1px',
                      marginTop: '-1px'
                    }}>
                      {Array.from({ length: 48 }, (_, index) => {
                        const hour = Math.floor(index / 2);
                        const minute = (index % 2) * 30;
                        const isFullHour = minute === 0;
                        return (
                          <div 
                            key={index}
                            style={{
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6',
                              borderTop: isFullHour ? '2px solid #dee2e6' : '1px solid #dee2e6',
                              height: '15px',
                              marginTop: isFullHour ? '-1px' : '0'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* booking button */}
          <button 
            className="login-button"
            style={{ marginTop: '20px' }}
            onClick={() => {
              // TODO:Handle booking submission
              console.log('Booking:', {
                date: selectedDate,
                startTime,
                endTime
              });
            }}
          >
            Book Room
          </button>
        </div>
      </div>
      <button className="home-button" onClick={() => navigateTo('home')}>Back to Home</button>
    </div>
  );
};

export default BookingPage; 