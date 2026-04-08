import React, { useState } from 'react';
import './TransportCards.css';

export default function FlightCard({ flight, onBook }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(flight.cabinClasses?.[0]);

  const availableCabins = flight.cabinClasses?.filter(c => c.availableSeats > 0) || [];

  return (
    <div className="transport-card card">
      <div className="card-main">
        <div className="card-operator">
          <div className="operator-logo flight-logo">✈</div>
          <div>
            <h3 className="operator-name">{flight.airline}</h3>
            <p className="operator-sub">{flight.flightNumber} · {flight.aircraft}</p>
          </div>
        </div>

        <div className="card-journey">
          <div className="journey-time">
            <span className="time-big">{flight.departureTime}</span>
            <span className="journey-city">{flight.fromCode}</span>
          </div>
          <div className="journey-middle">
            <span className="journey-duration">{flight.duration}</span>
            <div className="journey-line"><div className="journey-dot" /><div className="journey-track" /><div className="journey-dot" /></div>
            <span className={`journey-nonstop ${flight.stops > 0 ? 'has-stops' : ''}`}>
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="journey-time">
            <span className="time-big">{flight.arrivalTime}</span>
            <span className="journey-city">{flight.toCode}</span>
          </div>
        </div>

        <div className="card-meta">
          <div className="class-selector">
            {availableCabins.map(cabin => (
              <button
                key={cabin.classCode}
                className={`class-btn ${selectedCabin?.classCode === cabin.classCode ? 'active' : ''}`}
                onClick={() => setSelectedCabin(cabin)}
              >
                <span className="class-code">{cabin.classCode}</span>
                <span className="class-seats">{cabin.availableSeats}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card-price-action">
          <div className="price-block">
            <span className="price-main">₹{selectedCabin?.price?.toLocaleString()}</span>
            <span className="price-per">{selectedCabin?.refundable ? '✓ Refundable' : 'Non-refundable'}</span>
          </div>
          <button className="btn btn-primary" onClick={() => onBook(selectedCabin)} disabled={!selectedCabin}>Book Now</button>
          <button className="expand-btn" onClick={() => setExpanded(v => !v)}>
            {expanded ? '▲ Less' : '▼ More'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="card-expanded">
          <div className="divider" />
          <div className="expanded-grid">
            {availableCabins.map(cabin => (
              <div key={cabin.classCode} className="cabin-detail">
                <h4>{cabin.className}</h4>
                <div className="cabin-features">
                  <span>🧳 Check-in: {cabin.baggage}</span>
                  <span>👜 Cabin: {cabin.cabinBaggage}</span>
                  <span>{cabin.meal ? '🍽 Meal included' : '🍽 Meal not included'}</span>
                  <span>{cabin.refundable ? '✅ Refundable' : '❌ Non-refundable'}</span>
                </div>
              </div>
            ))}
            {flight.stops > 0 && flight.stopDetails?.length > 0 && (
              <div>
                <h4>Layover Details</h4>
                {flight.stopDetails.map((s, i) => (
                  <div key={i} className="stop-item">
                    <span className="stop-dot" />
                    <span>{s.airport}</span>
                    <span className="stop-time">{s.layoverDuration} layover</span>
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
