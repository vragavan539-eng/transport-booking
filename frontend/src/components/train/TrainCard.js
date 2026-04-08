import React, { useState } from 'react';
import './TransportCards.css';

export default function TrainCard({ train, onBook }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedClass, setSelectedClass] = useState(train.classes?.[0]);

  const availableClasses = train.classes?.filter(c => c.availableSeats > 0) || [];

  return (
    <div className="transport-card card">
      <div className="card-main">
        <div className="card-operator">
          <div className="operator-logo train-logo">🚆</div>
          <div>
            <h3 className="operator-name">{train.trainName}</h3>
            <p className="operator-sub">#{train.trainNumber} · <span className="badge badge-train">{train.trainType}</span></p>
          </div>
        </div>

        <div className="card-journey">
          <div className="journey-time">
            <span className="time-big">{train.departureTime}</span>
            <span className="journey-city">{train.fromCode}</span>
          </div>
          <div className="journey-middle">
            <span className="journey-duration">{train.duration}</span>
            <div className="journey-line"><div className="journey-dot" /><div className="journey-track" /><div className="journey-dot" /></div>
            <span className="journey-nonstop">{train.stops?.length > 0 ? `${train.stops.length} stops` : 'Direct'}</span>
          </div>
          <div className="journey-time">
            <span className="time-big">{train.arrivalTime}</span>
            <span className="journey-city">{train.toCode}</span>
          </div>
        </div>

        <div className="card-meta">
          <div className="class-selector">
            {availableClasses.map(cls => (
              <button
                key={cls.classCode}
                className={`class-btn ${selectedClass?.classCode === cls.classCode ? 'active' : ''}`}
                onClick={() => setSelectedClass(cls)}
              >
                <span className="class-code">{cls.classCode}</span>
                <span className="class-seats">{cls.availableSeats}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card-price-action">
          <div className="price-block">
            <span className="price-main">₹{selectedClass?.price?.toLocaleString()}</span>
            <span className="price-per">{selectedClass?.className}</span>
          </div>
          <button className="btn btn-primary" onClick={() => onBook(selectedClass)} disabled={!selectedClass}>Book Now</button>
          <button className="expand-btn" onClick={() => setExpanded(v => !v)}>
            {expanded ? '▲ Less' : '▼ More'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="card-expanded">
          <div className="divider" />
          <div className="expanded-grid">
            <div>
              <h4>All Classes</h4>
              <table className="class-table">
                <thead><tr><th>Class</th><th>Available</th><th>Price</th></tr></thead>
                <tbody>
                  {train.classes?.map(cls => (
                    <tr key={cls.classCode} className={cls.availableSeats === 0 ? 'sold-out' : ''}>
                      <td><strong>{cls.classCode}</strong> — {cls.className}</td>
                      <td>{cls.availableSeats === 0 ? 'Sold Out' : `${cls.availableSeats} seats`}</td>
                      <td>₹{cls.price?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h4>Running Days</h4>
              <div className="days-list">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <span key={d} className={`day-pill ${train.runningDays?.includes(d) ? 'day-active' : 'day-inactive'}`}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
