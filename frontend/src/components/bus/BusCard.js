import React, { useState } from 'react';
import './TransportCards.css';

export default function BusCard({ bus, onBook }) {
  const [expanded, setExpanded] = useState(false);
  const stars = '★'.repeat(Math.round(bus.rating)) + '☆'.repeat(5 - Math.round(bus.rating));

  return (
    <div className="transport-card card">
      <div className="card-main">
        {/* Operator & Type */}
        <div className="card-operator">
          <div className="operator-logo bus-logo">🚌</div>
          <div>
            <h3 className="operator-name">{bus.busName}</h3>
            <p className="operator-sub">{bus.operator} · <span className="badge badge-bus">{bus.busType}</span></p>
          </div>
        </div>

        {/* Journey */}
        <div className="card-journey">
          <div className="journey-time">
            <span className="time-big">{bus.departureTime}</span>
            <span className="journey-city">{bus.from}</span>
          </div>
          <div className="journey-middle">
            <span className="journey-duration">{bus.duration}</span>
            <div className="journey-line"><div className="journey-dot" /><div className="journey-track" /><div className="journey-dot" /></div>
            <span className="journey-nonstop">Direct</span>
          </div>
          <div className="journey-time">
            <span className="time-big">{bus.arrivalTime}</span>
            <span className="journey-city">{bus.to}</span>
          </div>
        </div>

        {/* Seats & Rating */}
        <div className="card-meta">
          <span className="stars">{stars}</span>
          <span className="rating-num">{bus.rating}</span>
          <div className="seats-info">
            <span className={bus.availableSeats < 10 ? 'seats-low' : 'seats-ok'}>
              {bus.availableSeats} seats left
            </span>
          </div>
        </div>

        {/* Price & Book */}
        <div className="card-price-action">
          <div className="price-block">
            <span className="price-main">₹{bus.price.toLocaleString()}</span>
            <span className="price-per">per seat</span>
          </div>
          <button className="btn btn-primary" onClick={onBook}>Book Now</button>
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
              <h4>Amenities</h4>
              <div className="amenities-list">
                {(bus.amenities || []).map(a => <span key={a} className="amenity-tag">{a}</span>)}
              </div>
            </div>
            <div>
              <h4>Cancellation Policy</h4>
              <p className="policy-text">{bus.cancellationPolicy}</p>
            </div>
            {bus.stops?.length > 0 && (
              <div>
                <h4>Stops</h4>
                {bus.stops.map((s, i) => (
                  <div key={i} className="stop-item">
                    <span className="stop-dot" />
                    <span>{s.station}</span>
                    <span className="stop-time">{s.arrivalTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
