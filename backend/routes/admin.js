require('dotenv').config();  // Load environment variables
const express = require('express');
const { client } = require('../db');
const nodemailer = require('nodemailer');
const router = express.Router();

const db = client.db('alchemist'); // Replace with your database name

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const { username, password } = req.headers; // Using headers for credentials

  // Check if admin credentials match the values from the .env file
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    return next(); // Proceed if authentication is successful
  } else {
    return res.status(401).send({ error: 'Unauthorized' }); // Respond with unauthorized if failed
  }
};

// Apply authentication middleware to all admin routes
// router.use(authenticateAdmin);

// Fetch all tickets (with user details)
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await db.collection('tickets').find().toArray();
    
    // Format the ticket data to send the required fields for the admin page
    const formattedTickets = tickets.map(ticket => ({
      ticketId: ticket.ticketId,
      name: ticket.name,
      email: ticket.email,
      phone: ticket.phone,
      description: ticket.description,
      status: ticket.status
    }));

    res.status(200).json(formattedTickets);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to fetch tickets.' });
  }
});

// Update ticket status
router.patch('/tickets/:id', async (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;

  try {
    
    // Update status in database
    const result = await db.collection('cluster0').findOneAndUpdate(
      { ticketId: ticketId }, // Assuming ticketId is the identifier in your database
      { $set: { status } },
      { returnDocument: 'after' }
    );
    console.log({result})

    if (!result) {
      return res.status(404).send({ error: 'Ticket not found.' });
    }

    const ticket = result;

    // Send status update email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: ticket.email,
      subject: `Ticket #${ticketId} Status Update`,
      text: `Hi ${ticket.name},\n\nThe status of your ticket has been updated to: ${status}.\n\nThank you!`,
    });

    res.status(200).send({ message: 'Status updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to update status.' });
  }
});

module.exports = router;
