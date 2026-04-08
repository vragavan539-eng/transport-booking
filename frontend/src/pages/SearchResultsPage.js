import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { busService, trainService, flightService } from '../services/api';
import BusCard from '../components/bus/BusCard';
import TrainCard from '../components/train/TrainCard';
import FlightCard from '../components/flight/FlightCard';
import SearchBox from '../components/common/SearchBox';
import './SearchResultsPage.css';

const TYPE_CONFIG = {
  bus: { label: 'Buses', icon: '🚌', color: 'bus', service: busService },
  train: { label: 'Trains', icon: '🚆', color: 'train', service: trainService },
  flight: { label: 'Flights', icon: '✈️', color: 'flight', service: flightService }
};

const SORT_OPTIONS = [
  { value: 'default', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'departure', label: 'Departure Time' },
  { value: 'rating', label: 'Rating' }
];

export default function SearchResultsPage() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.bus;
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('default');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', classCode: '', stops: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!from || !to || !date) return;
    setLoading(true);
    setError('');
    try {
      const params = { from, to, date, sort: sort !== 'default' ? sort : undefined };
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.classCode) params.classCode = filters.classCode;
      if (filters.stops !== '') params.stops = filters.stops;

      const { data } = await config.service.search(params);
      setResults(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, [from, to, date, sort, filters, config.service]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const handleBook = (item) => {
    navigate(`/book/${type}/${item._id}`, {
      state: { item, from, to, date }
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', classCode: '', stops: '' });
  };

  return (
    <div className="results-page">
      {/* Search bar strip */}
      <div className="results-search-bar">
        <div className="container">
          <SearchBox />
        </div>
      </div>

      <div className="container">
        {/* Header */}
        <div className="results-header">
          <div className="results-meta">
            <h2 className="results-title">
              <span className={`results-icon type-${type}`}>{config.icon}</span>
              {from} → {to}
            </h2>
            <p className="results-sub">
              {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {!loading && <span className="results-count"> · {results.length} {config.label} found</span>}
            </p>
          </div>

          <div className="results-controls">
            <button className="filter-toggle-btn" onClick={() => setShowFilters(v => !v)}>
              ⚙ Filters {Object.values(filters).some(Boolean) && <span className="filter-dot" />}
            </button>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="filters-panel card">
            <div className="filters-grid">
              <div className="form-group">
                <label className="form-label">Min Price (₹)</label>
                <input type="number" className="form-input" placeholder="0" value={filters.minPrice} onChange={e => handleFilterChange('minPrice', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Price (₹)</label>
                <input type="number" className="form-input" placeholder="Any" value={filters.maxPrice} onChange={e => handleFilterChange('maxPrice', e.target.value)} />
              </div>

              {type === 'train' && (
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <select className="form-input" value={filters.classCode} onChange={e => handleFilterChange('classCode', e.target.value)}>
                    <option value="">All Classes</option>
                    <option value="SL">Sleeper (SL)</option>
                    <option value="3A">3rd AC (3A)</option>
                    <option value="2A">2nd AC (2A)</option>
                    <option value="1A">1st AC (1A)</option>
                    <option value="CC">Chair Car (CC)</option>
                    <option value="EC">Executive Chair (EC)</option>
                  </select>
                </div>
              )}

              {type === 'flight' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Cabin Class</label>
                    <select className="form-input" value={filters.classCode} onChange={e => handleFilterChange('classCode', e.target.value)}>
                      <option value="">All Cabins</option>
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First Class</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stops</label>
                    <select className="form-input" value={filters.stops} onChange={e => handleFilterChange('stops', e.target.value)}>
                      <option value="">Any Stops</option>
                      <option value="0">Non-stop</option>
                      <option value="1">1 Stop</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}

        {/* Results */}
        <div className="results-layout">
          {loading ? (
            <div className="page-loader">
              <div className="spinner" />
              <p>Searching {config.label.toLowerCase()}...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="icon">❌</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchResults} style={{ marginTop: 16 }}>Try Again</button>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <div className="icon">{config.icon}</div>
              <h3>No {config.label} found</h3>
              <p>Try adjusting your filters or search for a different date</p>
            </div>
          ) : (
            <div className="results-list">
              {type === 'bus' && results.map(item => (
                <BusCard key={item._id} bus={item} onBook={() => handleBook(item)} />
              ))}
              {type === 'train' && results.map(item => (
                <TrainCard key={item._id} train={item} onBook={() => handleBook(item)} />
              ))}
              {type === 'flight' && results.map(item => (
                <FlightCard key={item._id} flight={item} onBook={() => handleBook(item)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
