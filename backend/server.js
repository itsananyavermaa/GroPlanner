// backend/server.js
require('dotenv').config();                 // 1️⃣ make sure .env loads first
const express = require('express');
const cors    = require('cors');

const aiRoutes   = require('./routes/ai');
const authRoutes = require('./routes/authRoutes');  // 2️⃣ your Google‑OAuth routes

const app = express();
app.use(cors());
app.use(express.json());

// 3️⃣  mount the Google and AI routers
app.use('/auth', authRoutes);   //  -> /auth/google   and  /auth/google/callback
app.use('/ai',   aiRoutes);     //  -> POST /ai/plan

// 4️⃣ start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
