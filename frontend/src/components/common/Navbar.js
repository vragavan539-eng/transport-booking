import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✈</span>
          <span className="brand-text">TripBook</span>
        </Link>

        <div className="navbar-links hide-mobile">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          {user && (
            <Link to="/my-trips" className={location.pathname === '/my-trips' ? 'nav-link active' : 'nav-link'}>My Trips</Link>
          )}
        </div>

        <div className="navbar-actions hide-mobile">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-avatar">
                <span>{user.name?.charAt(0).toUpperCase()}</span>
              </Link>
              <div className="user-dropdown">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
                <hr />
                <Link to="/profile">Profile</Link>
                <Link to="/my-trips">My Trips</Link>
                {user.role === 'admin' && <Link to="/admin">⚙ Admin Dashboard</Link>}
                <button onClick={handleLogout} className="logout-btn">Sign Out</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link to="/my-trips" onClick={() => setMenuOpen(false)}>My Trips</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
