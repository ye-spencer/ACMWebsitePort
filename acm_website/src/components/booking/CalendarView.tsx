import React from 'react';

interface CalendarViewProps {
  dates: Date[];
  isTimeSlotBooked: (date: Date, hour: number, minute: number) => boolean;
  formatDate: (date: Date) => string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ dates, isTimeSlotBooked, formatDate }) => (
  <div className="calendar-view">
    <h2 className="section-title">Calendar View</h2>
    <div className="calendar-container">
      <div className="time-labels">
        <div className="time-label-header">Time</div>
        <div className="time-label-grid">
          {Array.from({ length: 24 }, (_, hour) => {
            const time = new Date();
            time.setHours(hour, 0, 0, 0);
            return (
              <div key={hour} className="time-label">
                {time.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  hour12: true,
                })}
              </div>
            );
          })}
        </div>
      </div>
      {dates.map((date, dayIndex) => (
        <div key={dayIndex} className="calendar-day">
          <div
            className="calendar-day-title"
            style={{ color: date.toDateString() === new Date().toDateString() ? '#007bff' : '#333' }}
          >
            {formatDate(date)}
          </div>
          <div className="calendar-day-slots">
            {Array.from({ length: 48 }, (_, index) => {
              const hour = Math.floor(index / 2);
              const minute = (index % 2) * 30;
              const isFullHour = minute === 0;
              const isBooked = isTimeSlotBooked(date, hour, minute);
              return (
                <div
                  key={index}
                  className={`calendar-slot ${isBooked ? 'booked' : 'open'}${isFullHour ? ' full-hour' : ''}`}
                  title={isBooked ? 'booked' : 'open'}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CalendarView;
