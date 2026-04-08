import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const CITIES = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Coimbatore', 'Madurai', 'Trichy', 'Pune', 'Goa', 'Mysore', 'Kolkata'];

const offers = [
  { tag: 'Bus', code: 'FESTIVE300', title: 'Save up to ₹300 on bus tickets', valid: 'Valid till 14 Apr', bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)', icon: '🎫' },
  { tag: 'Bus', code: 'SUPERHIT', title: 'Save up to ₹300 on TN, Kerala routes', valid: 'Valid till 30 Apr', bg: 'linear-gradient(135deg,#fce4ec,#f8bbd0)', icon: '🚌' },
  { tag: 'Bus', code: 'CASH300', title: 'Save up to ₹300 on Karnataka routes', valid: 'Valid till 30 Apr', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)', icon: '💰' },
  { tag: 'Train', code: 'RAIL200', title: 'Save up to ₹200 on Train tickets', valid: 'Valid till 30 Apr', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', icon: '🚆' },
];

const whatsNew = [
  { title: 'Free Cancellation', desc: 'Get 100% refund on cancellation', bg: 'linear-gradient(135deg,#6d1b7b,#9c27b0)', color: '#fff', icon: '🛡️' },
  { title: 'Bus Timetable', desc: 'Get local bus timings between cities', bg: 'linear-gradient(135deg,#fff,#f5f5f5)', color: '#222', icon: '📅' },
  { title: 'FlexiTicket', desc: 'Amazing benefits on Date Change & Cancellation', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', color: '#222', icon: '🎟️' },
  { title: 'Assurance Program', desc: 'Insure your trip against cancellations!', bg: 'linear-gradient(135deg,#fff8e1,#ffecb3)', color: '#222', icon: '🧳' },
];

const tabs = [
  { key: 'bus', label: 'Bus tickets', icon: '🚌' },
  { key: 'train', label: 'Train tickets', icon: '🚆' },
  { key: 'flight', label: 'Flights', icon: '✈️' },
];

const popularRoutes = [
  ['Chennai', 'Bangalore'], ['Chennai', 'Madurai'], ['Mumbai', 'Pune'],
  ['Bangalore', 'Hyderabad'], ['Delhi', 'Agra'], ['Chennai', 'Coimbatore'],
  ['Mumbai', 'Goa'], ['Hyderabad', 'Bangalore'],
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bus');
  const [from, setFrom] = useState('Chennai');
  const [to, setTo] = useState('Madurai');
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [selectedDay, setSelectedDay] = useState('Today');
  const [copied, setCopied] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    setTimeout(() => setSearchVisible(true), 400);
    // Generate random stars for night sky
    setStars(Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
    })));
  }, []);

  const swap = () => { setFrom(to); setTo(from); };

  const handleSearch = () => {
    if (!from.trim() || !to.trim()) return;
    navigate(`/search/${activeTab}?from=${from}&to=${to}&date=${date}`);
  };

  const handleDayBtn = (label, val) => { setSelectedDay(label); setDate(val); };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="hp-page">

      {/* Promo Banner */}
      {showBanner && (
        <div className="hp-promo-bar">
          <span className="hp-promo-pulse">💸</span>
          <span>Get <b>10% Discount</b> — Use code <b>APP10</b></span>
          <button className="hp-promo-btn">Install TripBook App</button>
          <button className="hp-promo-close" onClick={() => setShowBanner(false)}>✕</button>
        </div>
      )}

      {/* ═══ HERO SECTION ═══ */}
      <div className="hp-hero">

        {/* Animated Sky */}
        <div className="hp-sky">
          {/* Stars */}
          {stars.map(s => (
            <div key={s.id} className="hp-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.size, height: s.size,
              animationDelay: `${s.delay}s`
            }} />
          ))}
          {/* Sun */}
          <div className="hp-sun" />
          {/* Clouds */}
          <div className="hp-cloud hp-cloud-1">☁️</div>
          <div className="hp-cloud hp-cloud-2">⛅</div>
          <div className="hp-cloud hp-cloud-3">☁️</div>
        </div>

        {/* Mountains */}
        <div className="hp-mountains">
          <div className="hp-mtn hp-mtn-far" />
          <div className="hp-mtn hp-mtn-mid" />
          <div className="hp-mtn hp-mtn-near" />
        </div>

        {/* Trees */}
        <div className="hp-trees">
          {['🌲','🌳','🌲','🌳','🌲','🌳','🌲','🌳','🌲','🌳','🌲','🌳'].map((t, i) => (
            <span key={i} className="hp-tree" style={{ animationDelay: `${i * 0.15}s`, fontSize: i % 3 === 0 ? 28 : 22 }}>{t}</span>
          ))}
        </div>

        {/* Road */}
        <div className="hp-road">
          <div className="hp-road-surface">
            <div className="hp-road-lines">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="hp-road-dash" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Animated vehicles */}
        <div className="hp-vehicles">
          <div className="hp-bus">🚌</div>
          <div className="hp-car">🚗</div>
          <div className="hp-truck">🚛</div>
          <div className="hp-bike">🏍️</div>
        </div>

        {/* Birds */}
        <div className="hp-birds">
          <span className="hp-bird hp-bird-1">🕊️</span>
          <span className="hp-bird hp-bird-2">🕊️</span>
        </div>

        {/* Hero Text */}
        <div className={`hp-hero-text ${heroVisible ? 'visible' : ''}`}>
          <h1 className="hp-hero-title">
            India's No. 1 online<br />
            <span className="hp-hero-red">bus ticket</span> booking site
          </h1>
          <p className="hp-hero-sub">Fast • Reliable • Affordable</p>
        </div>

        {/* Search Card */}
        <div className={`hp-search-card ${searchVisible ? 'visible' : ''}`}>
          {/* Mode Tabs */}
          <div className="hp-mode-tabs">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`hp-mode-tab ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                <span className="hp-tab-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="hp-fields">

            <div className="hp-field">
              <label className="hp-label"><span>🚌</span> From</label>
              <input
                className="hp-input"
                list="hp-from"
                value={from}
                onChange={e => setFrom(e.target.value)}
                placeholder="Departure city"
              />
              <datalist id="hp-from">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
            </div>

            <button className="hp-swap" onClick={swap} title="Swap cities">⇄</button>

            <div className="hp-field">
              <label className="hp-label"><span>📍</span> To</label>
              <input
                className="hp-input"
                list="hp-to"
                value={to}
                onChange={e => setTo(e.target.value)}
                placeholder="Destination city"
              />
              <datalist id="hp-to">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
            </div>

            <div className="hp-field hp-date-field">
              <label className="hp-label"><span>📅</span> Date of Journey</label>
              <div className="hp-date-display">
                <span className="hp-date-text">
                  {formatDate(date)}
                  {selectedDay && <small> ({selectedDay})</small>}
                </span>
                <div className="hp-day-btns">
                  <button className={`hp-day-btn ${selectedDay === 'Today' ? 'active' : ''}`} onClick={() => handleDayBtn('Today', todayStr)}>Today</button>
                  <button className={`hp-day-btn ${selectedDay === 'Tomorrow' ? 'active' : ''}`} onClick={() => handleDayBtn('Tomorrow', tomorrowStr)}>Tomorrow</button>
                </div>
              </div>
              <input type="date" className="hp-date-overlay" value={date} min={todayStr} onChange={e => { setDate(e.target.value); setSelectedDay(''); }} />
            </div>

          </div>

          <button className="hp-search-btn" onClick={handleSearch}>
            <span className="hp-search-icon">🔍</span>
            Search {tabs.find(t => t.key === activeTab)?.label}
          </button>
        </div>

      </div>

      {/* Train quick promo */}
      <div className="hp-train-bar">
        <div className="hp-container">
          <div className="hp-train-inner" onClick={() => { setActiveTab('train'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="hp-train-emoji">🚆</span>
            <div>
              <strong>Book trains for festivals</strong>
              <p>Book now to get confirmed ticket</p>
            </div>
            <span className="hp-train-arrow">›</span>
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="hp-section hp-container">
        <div className="hp-filter-row">
          <button className="hp-filter active">All</button>
          <button className="hp-filter">Bus</button>
          <button className="hp-filter">Train</button>
        </div>
        <div className="hp-offers-grid">
          {offers.map((o, i) => (
            <div key={i} className="hp-offer-card" style={{ background: o.bg, animationDelay: `${i * 0.1}s` }}>
              <div className="hp-offer-top">
                <span className="hp-offer-tag">{o.tag}</span>
                <span className="hp-offer-icon">{o.icon}</span>
              </div>
              <p className="hp-offer-title">{o.title}</p>
              <p className="hp-offer-valid">{o.valid}</p>
              <div className="hp-code-row">
                <span className="hp-code-icon">🏷</span>
                <span className="hp-code-text">{o.code}</span>
                <button className="hp-copy-btn" onClick={() => copyCode(o.code)}>
                  {copied === o.code ? '✅ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="hp-stats-bar">
        <div className="hp-container">
          <div className="hp-stats-grid">
            {[
              { val: '10M+', label: 'Happy Travelers', icon: '😊' },
              { val: '500+', label: 'Routes Covered', icon: '🗺️' },
              { val: '50+', label: 'Bus Operators', icon: '🚌' },
              { val: '99.9%', label: 'Uptime', icon: '⚡' },
            ].map((s, i) => (
              <div key={i} className="hp-stat-item">
                <span className="hp-stat-icon">{s.icon}</span>
                <span className="hp-stat-val">{s.val}</span>
                <span className="hp-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What's New */}
      <div className="hp-section hp-container">
        <h2 className="hp-section-h">What's new</h2>
        <div className="hp-wn-grid">
          {whatsNew.map((w, i) => (
            <div key={i} className="hp-wn-card" style={{ background: w.bg, animationDelay: `${i * 0.1}s` }}>
              <span className="hp-wn-icon">{w.icon}</span>
              <h3 style={{ color: w.color }}>{w.title}</h3>
              <p style={{ color: w.color === '#fff' ? 'rgba(255,255,255,0.8)' : '#666' }}>{w.desc}</p>
              <button className="hp-wn-link" style={{ color: w.color === '#fff' ? '#fff' : '#d84e55' }}>
                Know more →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Routes */}
      <div className="hp-section hp-container">
        <h2 className="hp-section-h">Popular Bus Routes</h2>
        <div className="hp-routes-wrap">
          {popularRoutes.map(([f, t], i) => (
            <button key={i} className="hp-route-pill"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => { setFrom(f); setTo(t); setActiveTab('bus'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              🚌 {f} → {t}
            </button>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="hp-footer-strip">
        <div className="hp-container">
          <p>🚌 TripBook — India's Trusted Travel Partner · Bus · Train · Flight</p>
        </div>
      </div>

    </div>
  );
}