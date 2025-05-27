import React from 'react';
import '../../styles/BookingPage.css';

interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

interface TimeSelectionProps {
  dates: Date[];
  startTime: Date;
  endTime: Date;
  timeSlots: TimeSlot[];
  bookingError: string;
  bookingSuccess: string;
  showMembershipPrompt: boolean;
  onDateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStartTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onEndTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  navigateTo: (page: string, errorMessage?: string) => void;
  formatDate: (date: Date) => string;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  dates,
  startTime,
  endTime,
  timeSlots,
  bookingError,
  bookingSuccess,
  showMembershipPrompt,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  navigateTo,
  formatDate
}) => (
  <div className="time-selection">
    <h2 className="section-title">Select Date and Time</h2>
    <div className="time-selection-column">
      <select
        className="booking-select"
        value={dates.findIndex(date =>
          date.getDate() === startTime.getDate() &&
          date.getMonth() === startTime.getMonth() &&
          date.getFullYear() === startTime.getFullYear()
        )}
        onChange={onDateChange}
      >
        {dates.map((date, index) => (
          <option key={index} value={index}>
            {formatDate(date)}
          </option>
        ))}
      </select>
      <div className="time-selects">
        <select
          className="booking-select"
          value={`${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`}
          onChange={onStartTimeChange}
        >
          {timeSlots.map((slot, index) => (
            <option
              key={index}
              value={`${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`}
            >
              {slot.label}
            </option>
          ))}
        </select>
        <select
          className="booking-select"
          value={`${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`}
          onChange={onEndTimeChange}
        >
          {timeSlots.map((slot, index) => {
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
      {(bookingError || bookingSuccess) && (
        <div className={`message ${bookingError ? 'error' : 'success'}`}>
          <span>{bookingError || bookingSuccess}</span>
          {showMembershipPrompt && (
            <button
              className="login-button"
              onClick={() => navigateTo('profile')}
              style={{ alignSelf: 'flex-start' }}
            >
              Go to Profile
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

export default TimeSelection;
