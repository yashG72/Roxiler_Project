// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Allows server to accept and parse JSON data

app.use('/api/auth', authRoutes);

// A simple test route to check if the server is running
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});