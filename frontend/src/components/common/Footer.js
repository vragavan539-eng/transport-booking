import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-logo">✈ TripBook</span>
            <p>Your one-stop platform for booking buses, trains, and flights across India. Fast, easy, reliable.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/my-trips">My Trips</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-links">
            <h4>Travel</h4>
            <span>Bus Booking</span>
            <span>Train Booking</span>
            <span>Flight Booking</span>
            <span>Cancellation Policy</span>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <span>Help Center</span>
            <span>Contact Us</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 TripBook. All rights reserved.</p>
          <p>Made with ♥ in India</p>
        </div>
      </div>
    </footer>
  );
}
