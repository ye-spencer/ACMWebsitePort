import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import '../styles/BookingPage.css';
import TimeSelection from '../components/booking/TimeSelection';
import CalendarView from '../components/booking/CalendarView';
import { TimeSlot } from '../types';
import { useApp } from '../hooks/useApp';
import { getUserData, getWeekBookings, createBooking } from '../api';

const BookingPage: React.FC = () => {
  const { user, navigateTo, error, authLoading } = useApp();
  const [startTime, setStartTime] = useState<Date>(() => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });
  const [endTime, setEndTime] = useState<Date>(() => {
    const date = new Date();
    date.setHours(10, 0, 0, 0);
    return date;
  });
  const [dates, setDates] = useState<Date[]>([]);
  const [week, setWeek] = useState<Date[][]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingError, setBookingError] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<string>('');
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [showMembershipPrompt, setShowMembershipPrompt] = useState<boolean>(false);

  // Initial auth check
  useEffect(() => {
    // Don't redirect while authentication is still loading
    if (authLoading) {
      return;
    }

    if (user) {
      const fetchUserMembership = async () => {
        try {
          const userData = await getUserData(user.uid);
          setIsMember(userData.isMember || false);
        } catch (error) {
          console.error('Error fetching user membership:', error);
          setIsMember(false);
        }
      };
      fetchUserMembership();
    } else {
      navigateTo('login', 'Please log in to access the booking page');
    }
  }, [user, navigateTo, authLoading]);

  // Generate time slots for dropdowns
  useEffect(() => {
    const slots: TimeSlot[] = [];
    // Start time slots (12 AM to 11:30 PM)
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
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

  useEffect(() => {
    // get bookings for the current week
    const fetchWeekBookings = async () => {
      try {
        const bookings = await getWeekBookings();
        const weekBookings = bookings.map((booking: any) => [
          new Date(booking.start),
          new Date(booking.end)
        ]);
        setWeek(weekBookings);
      } catch (error) {
        console.error('Error fetching week bookings:', error);
      }
    };
    fetchWeekBookings();
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
    const newDate = dates[selectedIndex];
    
    // Update both start and end times with the new date
    const newStartTime = new Date(startTime);
    newStartTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    setStartTime(newStartTime);

    const newEndTime = new Date(endTime);
    newEndTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    setEndTime(newEndTime);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newStartTime = new Date(startTime);
    newStartTime.setHours(hours, minutes, 0, 0);
    setStartTime(newStartTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newEndTime = new Date(endTime);
    newEndTime.setHours(hours, minutes, 0, 0);
    setEndTime(newEndTime);
  };

  const validateBookingTimes = async (): Promise<boolean> => {
    // Reset error message
    setBookingError('');

    // Check if start time is after end time
    if (startTime >= endTime) {
      setBookingError('End time must be after start time');
      return false;
    }

    // Check if booking duration is more than 2 hours
    const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (durationInHours > 2) {
      setBookingError('Booking duration cannot exceed 2 hours');
      return false;
    }

    // Check if any part of the requested time slot is already booked
    const checkTime = new Date(startTime);
    while (checkTime < endTime) {
      if (isTimeSlotBooked(
        checkTime,
        checkTime.getHours(),
        checkTime.getMinutes()
      )) {
        setBookingError('This time slot overlaps with an existing booking');
        return false;
      }
      // Check every 30 minutes
      checkTime.setMinutes(checkTime.getMinutes() + 30);
    }

    return true;
  };

  const handleBooking = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Reset messages
      setBookingError('');
      setBookingSuccess('');
      setShowMembershipPrompt(false);

      if (isMember === false) {
        setBookingError('You must be an ACM member to book a meeting.');
        setShowMembershipPrompt(true);
        return;
      }

      // Validate booking times before proceeding
      if (!(await validateBookingTimes())) {
        return;
      }

      // Create booking via API
      await createBooking(user.uid, startTime.toISOString(), endTime.toISOString());

      setBookingSuccess('Room successfully booked!');
      
      // Refresh week bookings
      const bookings = await getWeekBookings();
      const weekBookings = bookings.map((booking: any) => [
        new Date(booking.start),
        new Date(booking.end)
      ]);
      setWeek(weekBookings);
    } catch (error) {
      console.error('Error booking:', error);
      if (error instanceof Error) {
        setBookingError(error.message);
      } else {
        setBookingError('Failed to create booking. Please try again.');
      }
    }
  };

  const isTimeSlotBooked = (date: Date, hour: number, minute: number): boolean => {
    const slotTime = new Date(date);
    slotTime.setHours(hour, minute, 0, 0);
    
    return week.some(([start, end]) => {
      const slotStart = new Date(slotTime);
      const slotEnd = new Date(slotTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30); // Each slot is 30 minutes
      
      return (
        ((slotStart >= start && 
        slotStart < end) || // Check if slot starts during a booking
        (slotEnd > start &&
        slotEnd <= end)) && // Check if slot ends during a booking
        date.getDate() === start.getDate() && 
        date.getMonth() === start.getMonth() && 
        date.getFullYear() === start.getFullYear()
      );
    });
  };

  return (
    <div className="page">
      <div className="page-layout">
        <div className="page-header">
          <h1 className="page-title">Room Booking</h1>
          <p className="page-subtitle">Schedule a time to use the ACM Lounge in Malone Hall</p>
        </div>

        {error && (
          <div className="page-section error-section">
            <div className="error-message">{error}</div>
          </div>
        )}

        <div className="booking-content">
          <div className="page-section time-selection-section">
            <TimeSelection
              dates={dates}
              startTime={startTime}
              endTime={endTime}
              timeSlots={timeSlots}
              bookingError={bookingError}
              bookingSuccess={bookingSuccess}
              showMembershipPrompt={showMembershipPrompt}
              onDateChange={handleDateChange}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
              onBooking={handleBooking}
              navigateTo={navigateTo}
              formatDate={formatDate}
            />
          </div>

          <div className="page-section calendar-section">
            <CalendarView
              dates={dates}
              isTimeSlotBooked={isTimeSlotBooked}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 