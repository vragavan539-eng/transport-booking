import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { busService, trainService, flightService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './BookingPage.css';

const GENDERS = ['Male', 'Female', 'Other'];
const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'];
const TAX_RATE = 0.05;
const CONVENIENCE_FEE = 40;

const emptyPassenger = () => ({ name: '', age: '', gender: 'Male', seatNumber: '', idType: 'Aadhar', idNumber: '' });

export default function BookingPage() {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { from, to, date, item: passedItem } = location.state || {};
  const [item, setItem] = useState(passedItem || null);
  const [loading, setLoading] = useState(!passedItem);
  const [submitting, setSubmitting] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);
  const [passengers, setPassengers] = useState([emptyPassenger()]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [step, setStep] = useState(1); // 1=details, 2=review

  useEffect(() => {
    if (!item) {
      const svc = type === 'bus' ? busService : type === 'train' ? trainService : flightService;
      svc.getById(id).then(({ data }) => { setItem(data.data); setLoading(false); }).catch(() => setLoading(false));
    }
    // Pre-select first available class
    if (item) {
      if (type === 'train') setSelectedClass(item.classes?.[0]);
      if (type === 'flight') setSelectedClass(item.cabinClasses?.[0]);
    }
  }, [item, id, type]);

  const basePrice = type === 'bus' ? item?.price
    : type === 'train' ? selectedClass?.price
    : selectedClass?.price;

  const baseFare = (basePrice || 0) * passengers.length;
  const taxes = Math.round(baseFare * TAX_RATE);
  const totalFare = baseFare + taxes + CONVENIENCE_FEE;

  const addPassenger = () => {
    if (passengers.length >= 6) { toast.warning('Max 6 passengers per booking'); return; }
    setPassengers([...passengers, emptyPassenger()]);
  };

  const removePassenger = (i) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, idx) => idx !== i));
  };

  const updatePassenger = (i, field, value) => {
    const updated = [...passengers];
    updated[i] = { ...updated[i], [field]: value };
    setPassengers(updated);
  };

  const validatePassengers = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim()) { toast.error(`Passenger ${i + 1}: Name required`); return false; }
      if (!p.age || p.age < 1 || p.age > 120) { toast.error(`Passenger ${i + 1}: Valid age required`); return false; }
    }
    if (!contactEmail) { toast.error('Contact email required'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassengers()) return;
    setSubmitting(true);
    try {
      const payload = {
        transportType: type.charAt(0).toUpperCase() + type.slice(1),
        transportId: id,
        passengers: passengers.map(p => ({ ...p, age: Number(p.age) })),
        classType: selectedClass?.classCode || null,
        from, to,
        journeyDate: date,
        departureTime: item?.departureTime,
        arrivalTime: item?.arrivalTime,
        baseFare,
        taxes,
        convenienceFee: CONVENIENCE_FEE,
        paymentMethod,
        contactEmail,
        contactPhone
      };
      const { data } = await bookingService.create(payload);
      toast.success('Booking confirmed! 🎉');
      navigate(`/booking/confirmation/${data.data._id}`, { state: { booking: data.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><p>Loading details...</p></div>;
  if (!item) return <div className="empty-state"><div className="icon">❌</div><h3>Item not found</h3></div>;

  const typeIcon = { bus: '🚌', train: '🚆', flight: '✈️' }[type];
  const typeColor = { bus: 'bus', train: 'train', flight: 'flight' }[type];

  return (
    <div className="booking-page">
      <div className="container">
        {/* Journey summary bar */}
        <div className={`journey-bar card type-bar-${typeColor}`}>
          <span className="journey-bar-icon">{typeIcon}</span>
          <div className="journey-bar-info">
            <h2>{from} → {to}</h2>
            <p>{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · {item.busName || item.trainName || item.airline}</p>
          </div>
          <div className="journey-bar-times">
            <span>{item.departureTime}</span>
            <span className="bar-arrow">→</span>
            <span>{item.arrivalTime}</span>
            <span className="bar-duration">{item.duration}</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="steps-row">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}><span>1</span> Passenger Details</div>
          <div className="step-line" />
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}><span>2</span> Review & Pay</div>
        </div>

        <div className="booking-layout">
          {/* Main form */}
          <div className="booking-main">
            {step === 1 && (
              <>
                {/* Class selection for train/flight */}
                {(type === 'train' || type === 'flight') && (
                  <div className="booking-section card">
                    <h3 className="section-title">Select Class</h3>
                    <div className="class-options">
                      {(type === 'train' ? item.classes : item.cabinClasses)?.filter(c => c.availableSeats > 0).map(cls => (
                        <div
                          key={cls.classCode}
                          className={`class-option ${selectedClass?.classCode === cls.classCode ? 'selected' : ''}`}
                          onClick={() => setSelectedClass(cls)}
                        >
                          <div className="class-option-top">
                            <span className="class-option-code">{cls.classCode || cls.className}</span>
                            <span className="class-option-price">₹{cls.price?.toLocaleString()}</span>
                          </div>
                          <div className="class-option-name">{cls.className}</div>
                          <div className="class-option-seats">{cls.availableSeats} seats available</div>
                          {cls.baggage && <div className="class-option-baggage">🧳 {cls.baggage}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Passengers */}
                <div className="booking-section card">
                  <div className="section-title-row">
                    <h3 className="section-title">Passenger Details</h3>
                    <button className="btn btn-outline btn-sm" onClick={addPassenger}>+ Add Passenger</button>
                  </div>

                  {passengers.map((p, i) => (
                    <div key={i} className="passenger-block">
                      <div className="passenger-header">
                        <span className="passenger-num">Passenger {i + 1}</span>
                        {i > 0 && <button className="remove-btn" onClick={() => removePassenger(i)}>✕ Remove</button>}
                      </div>
                      <div className="passenger-grid">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label className="form-label">Full Name *</label>
                          <input className="form-input" placeholder="As on ID" value={p.name} onChange={e => updatePassenger(i, 'name', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Age *</label>
                          <input className="form-input" type="number" min="1" max="120" placeholder="Age" value={p.age} onChange={e => updatePassenger(i, 'age', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Gender</label>
                          <select className="form-input" value={p.gender} onChange={e => updatePassenger(i, 'gender', e.target.value)}>
                            {GENDERS.map(g => <option key={g}>{g}</option>)}
                          </select>
                        </div>
                        {type === 'bus' && (
                          <div className="form-group">
                            <label className="form-label">Seat Preference</label>
                            <input className="form-input" placeholder="e.g. Window, 12A" value={p.seatNumber} onChange={e => updatePassenger(i, 'seatNumber', e.target.value)} />
                          </div>
                        )}
                        <div className="form-group">
                          <label className="form-label">ID Type</label>
                          <select className="form-input" value={p.idType} onChange={e => updatePassenger(i, 'idType', e.target.value)}>
                            {['Aadhar','PAN','Passport','Driving License'].map(id => <option key={id}>{id}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">ID Number</label>
                          <input className="form-input" placeholder="ID number" value={p.idNumber} onChange={e => updatePassenger(i, 'idNumber', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <div className="booking-section card">
                  <h3 className="section-title">Contact Details</h3>
                  <div className="contact-grid">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" placeholder="Tickets will be sent here" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" type="tel" placeholder="+91 XXXXXXXXXX" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary btn-lg continue-btn" onClick={() => { if (validatePassengers()) setStep(2); }}>
                  Continue to Review →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Review summary */}
                <div className="booking-section card">
                  <h3 className="section-title">Booking Summary</h3>
                  <div className="review-passengers">
                    {passengers.map((p, i) => (
                      <div key={i} className="review-passenger">
                        <span className="pax-badge">P{i + 1}</span>
                        <span className="pax-name">{p.name}</span>
                        <span className="pax-meta">{p.age}y · {p.gender}</span>
                        {p.idNumber && <span className="pax-id">{p.idType}: {p.idNumber}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div className="booking-section card">
                  <h3 className="section-title">Payment Method</h3>
                  <div className="payment-options">
                    {PAYMENT_METHODS.map(m => (
                      <label key={m} className={`payment-option ${paymentMethod === m ? 'selected' : ''}`}>
                        <input type="radio" name="payment" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="booking-actions">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? <><span className="btn-spinner" /> Processing...</> : `Pay ₹${totalFare.toLocaleString()}`}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Fare sidebar */}
          <div className="fare-sidebar">
            <div className="fare-card card">
              <h3 className="fare-title">Fare Breakdown</h3>
              <div className="fare-lines">
                <div className="fare-line">
                  <span>Base fare ({passengers.length} pax)</span>
                  <span>₹{baseFare.toLocaleString()}</span>
                </div>
                <div className="fare-line">
                  <span>GST (5%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
                <div className="fare-line">
                  <span>Convenience fee</span>
                  <span>₹{CONVENIENCE_FEE}</span>
                </div>
                <div className="divider" />
                <div className="fare-line fare-total">
                  <span>Total Amount</span>
                  <span>₹{totalFare.toLocaleString()}</span>
                </div>
              </div>
              <div className="fare-note">
                <span>✅ Instant confirmation</span>
                <span>📧 E-ticket on email</span>
                <span>🔄 Free cancellation up to 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
