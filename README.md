# TripBook — Full Stack Transport Booking System

> Book Bus, Train & Flight tickets — React + Node.js + Express + MongoDB

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, React Toastify |
| Backend | Node.js, Express.js, JWT Auth, Mongoose ODM |
| Database | MongoDB (works with MongoDB Compass & Atlas) |
| Styling | Custom CSS with Google Fonts (Sora + DM Sans) |

---

## Project Structure

```
transport-booking/
├── backend/
│   ├── server.js              # Express entry point
│   ├── .env                   # Environment variables
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Bus.model.js
│   │   ├── Train.model.js
│   │   ├── Flight.model.js
│   │   └── Booking.model.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── bus.controller.js
│   │   ├── train.controller.js
│   │   ├── flight.controller.js
│   │   └── booking.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── bus.routes.js
│   │   ├── train.routes.js
│   │   ├── flight.routes.js
│   │   ├── booking.routes.js
│   │   └── user.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   └── seed/
│       └── seedData.js        # Sample data: buses, trains, flights
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css            # Global design system
        ├── context/
        │   └── AuthContext.js   # Global auth state
        ├── services/
        │   └── api.js           # Axios instance + all API calls
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.js
        │   │   ├── Footer.js
        │   │   └── SearchBox.js  # Tabbed bus/train/flight search
        │   ├── bus/
        │   │   └── BusCard.js
        │   ├── train/
        │   │   └── TrainCard.js
        │   └── flight/
        │       └── FlightCard.js
        └── pages/
            ├── HomePage.js
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── SearchResultsPage.js
            ├── BookingPage.js
            ├── BookingConfirmationPage.js
            ├── MyTripsPage.js
            └── ProfilePage.js
```

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally OR a MongoDB Atlas URI
- npm or yarn

### 1. Clone and install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/transport_booking
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- 8 buses (Chennai↔Bangalore, Mumbai↔Pune, etc.)
- 5 trains (including Rajdhani, Shatabdi, Vande Bharat)
- 6 flights (Air India, IndiGo, SpiceJet, Vistara)
- Admin user: `admin@transport.com` / `admin123`

### 4. Run the app

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # Starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm start          # Starts on http://localhost:3000
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | User | Get current user |

### Bus

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/buses/search?from=Chennai&to=Bangalore&date=2025-01-15` | Public | Search buses |
| GET | `/api/buses/:id` | Public | Get bus details |
| POST | `/api/buses` | Admin | Create bus |
| PUT | `/api/buses/:id` | Admin | Update bus |
| DELETE | `/api/buses/:id` | Admin | Delete bus |

### Train

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/trains/search?from=MAS&to=SBC&date=2025-01-15` | Public | Search trains |
| GET | `/api/trains/:id` | Public | Get train details |
| POST | `/api/trains` | Admin | Create train |

### Flight

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/flights/search?from=MAA&to=DEL&date=2025-01-15` | Public | Search flights |
| GET | `/api/flights/:id` | Public | Get flight details |
| POST | `/api/flights` | Admin | Create flight |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings/my` | User | Get my bookings |
| GET | `/api/bookings/:id` | User | Get booking by ID |
| PUT | `/api/bookings/:id/cancel` | User | Cancel booking (85% refund) |
| GET | `/api/bookings` | Admin | Get all bookings |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PUT | `/api/users/profile` | User | Update name/phone |
| PUT | `/api/users/change-password` | User | Change password |
| GET | `/api/users` | Admin | List all users |

---

## Search Query Parameters

**Buses:** `from`, `to`, `date`, `busType`, `minPrice`, `maxPrice`, `sort`

**Trains:** `from`, `to`, `date`, `classCode` (SL/3A/2A/1A/CC/EC), `sort`

**Flights:** `from`, `to`, `date`, `classCode` (Economy/Business/First), `stops` (0/1), `airline`, `sort`

**Sort values:** `price_asc`, `price_desc`, `departure`, `rating`, `duration`

---

## Features

- JWT authentication with protected routes
- Search buses, trains, flights by route and date
- Filter by price range, class, stops
- Sort by price, departure time, rating
- Multi-passenger booking (up to 6)
- Class/cabin selection for trains and flights
- Fare breakdown with GST and convenience fee
- Booking confirmation with PNR
- Cancel booking with 85% refund
- My Trips dashboard
- Profile management
- Admin seed data with real Indian routes
- Responsive design for mobile and desktop

---

## MongoDB Compass

Open Compass and connect to: `mongodb://localhost:27017`

Collections you'll see after seeding:
- `users` — registered users
- `buses` — bus routes and schedules
- `trains` — train routes with class info
- `flights` — flights with cabin classes
- `bookings` — all booking records

---

## Extending the Project

### Add payment gateway (Razorpay)
```bash
cd backend && npm install razorpay
```
Add `POST /api/payments/create-order` and `POST /api/payments/verify` routes.

### Add email notifications (Nodemailer)
```bash
cd backend && npm install nodemailer
```
Send confirmation emails from the booking controller after a successful booking.

### Add admin dashboard
Create a new `/admin` route group in React, guarded by `role === 'admin'`, showing:
- All bookings table
- Revenue stats
- Add/edit/delete transport routes

### Deploy

**Backend (Railway / Render):**
- Set `MONGO_URI` to your Atlas URI
- Set `NODE_ENV=production`
- Set `JWT_SECRET` to a strong random string

**Frontend (Vercel / Netlify):**
- Set `REACT_APP_API_URL` if not using proxy
- Update `package.json` proxy field

---

## License

MIT — free to use and modify.
