# 🌿 Nourish — Rescue Food, Feed Hope
### Built for MANIT Bhopal · Fighting hostel mess & wedding food waste

A full-stack real-time food rescue platform connecting MANIT hostel messes, college canteens, and Bhopal wedding halls with volunteers and NGOs.

---

## 📁 Project Structure

```
nourish/
├── backend/          ← Node.js + Express + MongoDB + Socket.io
└── frontend/         ← React + Vite + Leaflet + Socket.io-client
```

---

## 🚀 Setup Guide (Step by Step)

### 1. MongoDB Atlas (free)
1. Go to https://cloud.mongodb.com → create free account
2. Create a free M0 cluster
3. Click **Connect → Drivers** → copy the URI
4. Whitelist your IP (or use 0.0.0.0/0 for dev)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — paste your MongoDB URI and set JWT_SECRET
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# .env already set to http://localhost:5000 for local dev
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🌐 Deployment

### Backend → Render (free)
1. Push backend folder to GitHub
2. Go to https://render.com → New Web Service
3. Connect repo → Build command: `npm install` → Start: `npm start`
4. Add environment variables from your .env

### Frontend → Vercel (free)
1. Push frontend folder to GitHub
2. Go to https://vercel.com → Import project
3. Set `VITE_API_URL` = your Render backend URL (e.g. https://nourish-api.onrender.com)
4. Deploy

---

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
