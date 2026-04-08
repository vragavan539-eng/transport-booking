import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingService } from '../services/api';
import './MyTripsPage.css';

const TYPE_ICON = { Bus: '🚌', Train: '🚆', Flight: '✈️' };

export default function MyTripsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    bookingService.getMyBookings()
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking? 85% refund will be processed.')) return;
    setCancelling(bookingId);
    try {
      const { data } = await bookingService.cancel(bookingId, 'User requested cancellation');
      setBookings(prev => prev.map(b => b._id === bookingId ? data.data : b));
      toast.success(data.message || 'Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status.toLowerCase() === filter);
  const counts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    completed: bookings.filter(b => b.status === 'Completed').length
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><p>Loading your trips...</p></div>;

  return (
    <div className="trips-page">
      <div className="container">
        <div className="trips-header">
          <h1>My Trips</h1>
          <p>All your bookings in one place</p>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {Object.entries(counts).map(([key, count]) => (
            <button
              key={key}
              className={`filter-tab ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <span className="tab-count">{count}</span>
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎫</div>
            <h3>No {filter !== 'all' ? filter : ''} bookings yet</h3>
            <p>Time to plan your next journey!</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Search & Book</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map(booking => (
              <div key={booking._id} className={`booking-card card ${booking.status === 'Cancelled' ? 'cancelled' : ''}`}>
                <div className="booking-card-main">
                  {/* Left: type + route */}
                  <div className="bc-left">
                    <div className="bc-type-icon">{TYPE_ICON[booking.transportType] || '🎫'}</div>
                    <div>
                      <div className="bc-route">{booking.from} → {booking.to}</div>
                      <div className="bc-type-label">{booking.transportType}</div>
                    </div>
                  </div>

                  {/* Middle: journey info */}
                  <div className="bc-middle">
                    <div className="bc-info-row">
                      <span className="bc-info-label">Date</span>
                      <span className="bc-info-value">
                        {new Date(booking.journeyDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="bc-info-row">
                      <span className="bc-info-label">Passengers</span>
                      <span className="bc-info-value">{booking.passengers?.length} person{booking.passengers?.length > 1 ? 's' : ''}</span>
                    </div>
                    {booking.classType && (
                      <div className="bc-info-row">
                        <span className="bc-info-label">Class</span>
                        <span className="bc-info-value">{booking.classType}</span>
                      </div>
                    )}
                    <div className="bc-info-row">
                      <span className="bc-info-label">PNR</span>
                      <span className="bc-info-value bc-pnr">{booking.bookingId}</span>
                    </div>
                  </div>

                  {/* Right: fare + status + actions */}
                  <div className="bc-right">
                    <div className="bc-fare">₹{booking.totalFare?.toLocaleString()}</div>
                    <span className={`badge badge-${booking.status.toLowerCase()}`}>{booking.status}</span>

                    {booking.status === 'Cancelled' && booking.refundAmount && (
                      <div className="bc-refund">
                        Refund: ₹{booking.refundAmount?.toFixed(0)}
                      </div>
                    )}

                    <div className="bc-actions">
                      <Link to={`/booking/confirmation/${booking._id}`} className="btn btn-outline btn-sm">View</Link>
                      {booking.status === 'Confirmed' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                        >
                          {cancelling === booking._id ? '...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Passengers preview */}
                <div className="bc-passengers">
                  {booking.passengers?.map((p, i) => (
                    <span key={i} className="pax-chip">{p.name} ({p.age}y)</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
