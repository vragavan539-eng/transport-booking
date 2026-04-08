import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import './BookingConfirmationPage.css';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      bookingService.getById(id)
        .then(({ data }) => setBooking(data.data))
        .catch(() => navigate('/my-trips'))
        .finally(() => setLoading(false));
    }
  }, [id, booking, navigate]);

  if (loading) return <div className="page-loader"><div className="spinner" /><p>Loading confirmation...</p></div>;
  if (!booking) return null;

  const typeIcon = { Bus: '🚌', Train: '🚆', Flight: '✈️' }[booking.transportType];

  return (
    <div className="confirmation-page">
      <div className="container">
        {/* Success banner */}
        <div className="success-banner">
          <div className="success-circle">✓</div>
          <h1>Booking Confirmed!</h1>
          <p>Your e-ticket has been sent to <strong>{booking.contactEmail}</strong></p>
        </div>

        {/* PNR card */}
        <div className="pnr-card card">
          <div className="pnr-left">
            <span className="pnr-label">Booking ID / PNR</span>
            <span className="pnr-number">{booking.bookingId}</span>
            <span className={`badge badge-${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>
          <div className="pnr-right">
            <div className="pnr-meta"><span>Transport</span><strong>{typeIcon} {booking.transportType}</strong></div>
            <div className="pnr-meta"><span>Payment</span><strong>{booking.paymentMethod}</strong></div>
            <div className="pnr-meta"><span>Amount Paid</span><strong className="pnr-amount">₹{booking.totalFare?.toLocaleString()}</strong></div>
          </div>
        </div>

        {/* Journey details */}
        <div className="confirmation-card card">
          <h3 className="conf-section-title">Journey Details</h3>
          <div className="journey-details">
            <div className="jd-block">
              <span className="jd-label">From</span>
              <span className="jd-value">{booking.from}</span>
              <span className="jd-time">{booking.departureTime}</span>
            </div>
            <div className="jd-arrow">{typeIcon}</div>
            <div className="jd-block jd-right">
              <span className="jd-label">To</span>
              <span className="jd-value">{booking.to}</span>
              <span className="jd-time">{booking.arrivalTime}</span>
            </div>
          </div>
          <div className="journey-date">
            📅 {new Date(booking.journeyDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {booking.classType && <span className="journey-class"> · Class: {booking.classType}</span>}
          </div>
        </div>

        {/* Passengers */}
        <div className="confirmation-card card">
          <h3 className="conf-section-title">Passengers ({booking.passengers?.length})</h3>
          <div className="passengers-table">
            <div className="pt-header">
              <span>#</span><span>Name</span><span>Age</span><span>Gender</span><span>ID</span>
            </div>
            {booking.passengers?.map((p, i) => (
              <div key={i} className="pt-row">
                <span className="pt-num">{i + 1}</span>
                <span className="pt-name">{p.name}</span>
                <span>{p.age}y</span>
                <span>{p.gender}</span>
                <span className="pt-id">{p.idType}: {p.idNumber || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fare breakdown */}
        <div className="confirmation-card card">
          <h3 className="conf-section-title">Fare Breakdown</h3>
          <div className="fare-table">
            <div className="fare-row"><span>Base Fare</span><span>₹{booking.baseFare?.toLocaleString()}</span></div>
            <div className="fare-row"><span>GST</span><span>₹{booking.taxes?.toLocaleString()}</span></div>
            <div className="fare-row"><span>Convenience Fee</span><span>₹{booking.convenienceFee}</span></div>
            <div className="fare-row fare-total-row"><span>Total Paid</span><span>₹{booking.totalFare?.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Actions */}
        <div className="confirmation-actions">
          <button onClick={() => window.print()} className="btn btn-outline">🖨 Print Ticket</button>
          <Link to="/my-trips" className="btn btn-outline">📋 My Trips</Link>
          <Link to="/" className="btn btn-primary">Book Another</Link>
        </div>
      </div>
    </div>
  );
}
