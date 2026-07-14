# 🌿 Nourish — Rescue Food, Feed Hope
# Nourish

Nourish is a full-stack MERN application that helps reduce food waste by connecting food donors with NGOs and organizations. It provides a simple platform where donors can list surplus food, NGOs can browse available donations, and both parties can coordinate efficiently to ensure food reaches people in need instead of going to waste.

## Features

- Secure authentication and authorization using JWT
- Role-based access for donors and NGOs
- Create, update, and manage food donations
- Browse and accept available donations
- Responsive and intuitive user interface
- RESTful API architecture
- Secure password hashing with bcrypt
- MongoDB database integration

## Tech Stack

**Frontend**
- React.js
- Vite
- React Router
- Axios
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```
Nourish/
├── frontend/
├── backend/
└── README.md
```

## Future Improvements

- Real-time notifications
- Live donation tracking
- Google Maps integration
- Image uploads
- Email notifications
- Admin dashboard


## 👥 User Roles

| Role | Can do |
|------|--------|
| **Donor** | Post surplus food listings, confirm pickups |
| **Volunteer** | View map, claim listings, mark delivered |
| **NGO** | Same as volunteer, with org-level dashboard |

## 🏫 Pre-configured Locations (Bhopal)
- MANIT Bhopal Hostel & Canteen
- MP Nagar, TT Nagar, Arera Colony
- Habibganj, Ayodhya Nagar, New Market

## 🛠 Tech Stack
- **Frontend:** React 18, Vite, React Router, Leaflet.js, Socket.io-client, Axios
- **Backend:** Node.js, Express, MongoDB + Mongoose, Socket.io, JWT, node-cron
- **Deploy:** Vercel (FE) + Render (BE) + MongoDB Atlas (DB)

## ✨ Features
- 🗺 Live map with real-time listing updates via WebSockets
- ⏱ Auto-expiry cron job for stale listings
- 🔐 JWT auth with 3 role types
- 🏆 Volunteer leaderboard + badge system
- 📊 City-wide impact dashboard (meals, CO₂, kg saved)
- 📍 Location presets for MANIT Bhopal & Bhopal zones
- 🎊 Wedding hall & mess quick templates
