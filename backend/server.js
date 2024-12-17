require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ticketsRouter = require('./routes/tickets');
const adminRouter = require('./routes/admin');
const { getTickets } = require('./db');  // Assuming getTickets fetches tickets from DB

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static frontend files

// API Routes
app.use('/api/tickets', ticketsRouter);
app.use('/api/admin', adminRouter);

// Route to fetch tickets for the admin page
app.get('/api/admin/tickets', async (req, res) => {
  try {
    const tickets = await getTickets(); // Assuming getTickets fetches tickets from DB
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Fallback route to serve index.html or admin.html for unmatched routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, '../frontend/public/admin.html')); // Serve admin.html for admin routes
  } else {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html')); // Serve index.html for other routes
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
