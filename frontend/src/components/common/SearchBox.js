import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBox.css';

const tabs = [
  { key: 'bus', label: 'Bus', icon: '🚌' },
  { key: 'train', label: 'Train', icon: '🚆' },
  { key: 'flight', label: 'Flight', icon: '✈️' }
];

const CITIES = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Coimbatore', 'Madurai', 'Trichy', 'Pune', 'Goa', 'Mysore', 'Kolkata'];

export default function SearchBox() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bus');
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.from.trim()) errs.from = 'Select departure city';
    if (!form.to.trim()) errs.to = 'Select destination city';
    if (form.from && form.to && form.from.toLowerCase() === form.to.toLowerCase()) errs.to = 'From and To cannot be same';
    if (!form.date) errs.date = 'Select travel date';
    return errs;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const params = new URLSearchParams({ from: form.from, to: form.to, date: form.date });
    navigate(`/search/${activeTab}?${params}`);
  };

  const swap = () => {
    setForm({ ...form, from: form.to, to: form.from });
  };

  return (
    <div className="search-box">
      {/* Tabs */}
      <div className="search-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`search-tab ${activeTab === tab.key ? 'active' : ''} tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-fields">
          {/* From */}
          <div className="search-field">
            <label className="search-label">From</label>
            <div className="search-input-wrap">
              <span className="search-field-icon">📍</span>
              <input
                type="text"
                name="from"
                list="from-cities"
                placeholder="Departure city"
                value={form.from}
                onChange={handleChange}
                className={`search-input ${errors.from ? 'error' : ''}`}
                autoComplete="off"
              />
              <datalist id="from-cities">
                {CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            {errors.from && <span className="field-error">{errors.from}</span>}
          </div>

          {/* Swap */}
          <button type="button" className="swap-btn" onClick={swap} title="Swap cities">⇄</button>

          {/* To */}
          <div className="search-field">
            <label className="search-label">To</label>
            <div className="search-input-wrap">
              <span className="search-field-icon">🏁</span>
              <input
                type="text"
                name="to"
                list="to-cities"
                placeholder="Destination city"
                value={form.to}
                onChange={handleChange}
                className={`search-input ${errors.to ? 'error' : ''}`}
                autoComplete="off"
              />
              <datalist id="to-cities">
                {CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            {errors.to && <span className="field-error">{errors.to}</span>}
          </div>

          {/* Date */}
          <div className="search-field">
            <label className="search-label">Date</label>
            <div className="search-input-wrap">
              <span className="search-field-icon">📅</span>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`search-input ${errors.date ? 'error' : ''}`}
              />
            </div>
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>

          {/* Submit */}
          <button type="submit" className={`search-btn btn-${activeTab}`}>
            Search {tabs.find(t => t.key === activeTab)?.label}s
          </button>
        </div>
      </form>
    </div>
  );
}
