import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminPage.css';

const TABS = [
  { key: 'overview', label: '📊 Overview' },
  { key: 'bookings', label: '🎫 Bookings' },
  { key: 'buses', label: '🚌 Buses' },
  { key: 'trains', label: '🚆 Trains' },
  { key: 'flights', label: '✈️ Flights' },
  { key: 'users', label: '👥 Users' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({ bookings: [], buses: [], trains: [], flights: [], users: [] });
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [b, bu, tr, fl, us] = await Promise.all([
          api.get('/bookings'),
          api.get('/buses'),
          api.get('/trains'),
          api.get('/flights'),
          api.get('/users'),
        ]);
        setData({
          bookings: b.data.data || [],
          buses: bu.data.data || [],
          trains: tr.data.data || [],
          flights: fl.data.data || [],
          users: us.data.data || [],
        });
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalRevenue = data.bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.totalFare || 0), 0);

  const stats = [
    { label: 'Total Bookings', value: data.bookings.length, color: 'blue', icon: '🎫' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'green', icon: '💰' },
    { label: 'Active Users', value: data.users.length, color: 'purple', icon: '👥' },
    { label: 'Transport Routes', value: data.buses.length + data.trains.length + data.flights.length, color: 'amber', icon: '🗺️' },
  ];

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Delete this bus?')) return;
    try {
      await api.delete(`/buses/${id}`);
      setData(d => ({ ...d, buses: d.buses.filter(b => b._id !== id) }));
      toast.success('Bus deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleDeleteTrain = async (id) => {
    if (!window.confirm('Delete this train?')) return;
    try {
      await api.delete(`/trains/${id}`);
      setData(d => ({ ...d, trains: d.trains.filter(t => t._id !== id) }));
      toast.success('Train deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleDeleteFlight = async (id) => {
    if (!window.confirm('Delete this flight?')) return;
    try {
      await api.delete(`/flights/${id}`);
      setData(d => ({ ...d, flights: d.flights.filter(f => f._id !== id) }));
      toast.success('Flight deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage bookings, routes, and users</p>
          </div>
          <Link to="/" className="btn btn-outline btn-sm">← Back to Site</Link>
        </div>

        {/* Tab navigation */}
        <div className="admin-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`admin-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /><p>Loading admin data...</p></div>
        ) : (
          <>
            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="admin-section">
                <div className="stats-cards">
                  {stats.map(s => (
                    <div key={s.label} className={`stat-card stat-${s.color}`}>
                      <span className="stat-card-icon">{s.icon}</span>
                      <div>
                        <div className="stat-card-value">{s.value}</div>
                        <div className="stat-card-label">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="overview-grid">
                  {/* Recent bookings */}
                  <div className="overview-card card">
                    <h3>Recent Bookings</h3>
                    <table className="admin-table">
                      <thead>
                        <tr><th>PNR</th><th>Route</th><th>Type</th><th>Amount</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {data.bookings.slice(0, 8).map(b => (
                          <tr key={b._id}>
                            <td className="mono">{b.bookingId}</td>
                            <td>{b.from} → {b.to}</td>
                            <td>{b.transportType}</td>
                            <td>₹{b.totalFare?.toLocaleString()}</td>
                            <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Booking breakdown */}
                  <div className="overview-card card">
                    <h3>Booking Breakdown</h3>
                    <div className="breakdown-list">
                      {['Bus', 'Train', 'Flight'].map(type => {
                        const count = data.bookings.filter(b => b.transportType === type).length;
                        const pct = data.bookings.length ? Math.round((count / data.bookings.length) * 100) : 0;
                        return (
                          <div key={type} className="breakdown-item">
                            <div className="breakdown-label">
                              <span>{type === 'Bus' ? '🚌' : type === 'Train' ? '🚆' : '✈️'} {type}</span>
                              <span>{count} bookings ({pct}%)</span>
                            </div>
                            <div className="breakdown-bar">
                              <div
                                className={`breakdown-fill fill-${type.toLowerCase()}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="breakdown-summary">
                      <div className="bs-item">
                        <span>Confirmed</span>
                        <strong className="text-success">{data.bookings.filter(b => b.status === 'Confirmed').length}</strong>
                      </div>
                      <div className="bs-item">
                        <span>Cancelled</span>
                        <strong className="text-danger">{data.bookings.filter(b => b.status === 'Cancelled').length}</strong>
                      </div>
                      <div className="bs-item">
                        <span>Completed</span>
                        <strong>{data.bookings.filter(b => b.status === 'Completed').length}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ALL BOOKINGS */}
            {tab === 'bookings' && (
              <div className="admin-section">
                <div className="section-toolbar">
                  <h2>All Bookings ({data.bookings.length})</h2>
                </div>
                <div className="card table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>PNR</th><th>User</th><th>Route</th><th>Type</th>
                        <th>Date</th><th>Passengers</th><th>Amount</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.bookings.map(b => (
                        <tr key={b._id}>
                          <td className="mono">{b.bookingId}</td>
                          <td>{b.user?.name || '—'}<br /><small className="text-muted">{b.user?.email}</small></td>
                          <td>{b.from} → {b.to}</td>
                          <td>
                            <span className={`badge badge-${b.transportType?.toLowerCase()}`}>
                              {b.transportType}
                            </span>
                          </td>
                          <td>{new Date(b.journeyDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                          <td>{b.passengers?.length}</td>
                          <td>₹{b.totalFare?.toLocaleString()}</td>
                          <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BUSES */}
            {tab === 'buses' && (
              <div className="admin-section">
                <div className="section-toolbar">
                  <h2>Buses ({data.buses.length})</h2>
                </div>
                <div className="card table-card">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Bus #</th><th>Name</th><th>Route</th><th>Type</th><th>Seats</th><th>Price</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {data.buses.map(b => (
                        <tr key={b._id}>
                          <td className="mono">{b.busNumber}</td>
                          <td><strong>{b.busName}</strong><br /><small className="text-muted">{b.operator}</small></td>
                          <td>{b.from} → {b.to}</td>
                          <td><span className="badge badge-bus">{b.busType}</span></td>
                          <td>{b.availableSeats}/{b.totalSeats}</td>
                          <td>₹{b.price?.toLocaleString()}</td>
                          <td>{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBus(b._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TRAINS */}
            {tab === 'trains' && (
              <div className="admin-section">
                <div className="section-toolbar">
                  <h2>Trains ({data.trains.length})</h2>
                </div>
                <div className="card table-card">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Train #</th><th>Name</th><th>Route</th><th>Type</th><th>Classes</th><th>Departure</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {data.trains.map(t => (
                        <tr key={t._id}>
                          <td className="mono">{t.trainNumber}</td>
                          <td><strong>{t.trainName}</strong></td>
                          <td>{t.fromCode} → {t.toCode}</td>
                          <td><span className="badge badge-train">{t.trainType}</span></td>
                          <td>{t.classes?.map(c => c.classCode).join(', ')}</td>
                          <td>{t.departureTime}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTrain(t._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FLIGHTS */}
            {tab === 'flights' && (
              <div className="admin-section">
                <div className="section-toolbar">
                  <h2>Flights ({data.flights.length})</h2>
                </div>
                <div className="card table-card">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Flight #</th><th>Airline</th><th>Route</th><th>Stops</th><th>Cabins</th><th>Departure</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {data.flights.map(f => (
                        <tr key={f._id}>
                          <td className="mono">{f.flightNumber}</td>
                          <td><strong>{f.airline}</strong><br /><small className="text-muted">{f.aircraft}</small></td>
                          <td>{f.fromCode} → {f.toCode}</td>
                          <td>{f.stops === 0 ? <span className="text-success">Non-stop</span> : `${f.stops} stop`}</td>
                          <td>{f.cabinClasses?.map(c => c.classCode).join(', ')}</td>
                          <td>{f.departureTime}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFlight(f._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <div className="admin-section">
                <div className="section-toolbar">
                  <h2>Users ({data.users.length})</h2>
                </div>
                <div className="card table-card">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr>
                    </thead>
                    <tbody>
                      {data.users.map(u => (
                        <tr key={u._id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.phone || '—'}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-flight' : 'badge-confirmed'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
