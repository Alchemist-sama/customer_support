const express = require('express');
const nodemailer = require('nodemailer');
const { client } = require('../db'); // Import the MongoDB client
const db = client.db('alchemist'); // Replace with your database name


const router = express.Router();

const dbName = 'alchemist'; // Replace with your database name
const collectionName = 'cluster0'; // Replace with your collection name

router.post('/', async (req, res) => {
  const { name, email, phone, description } = req.body;
  const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    // Connect to MongoDB and insert the ticket
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const ticketData = {
      ticketId,
      name,
      email,
      phone,
      description,
      status: 'Open', // Initial status
      createdAt: new Date(),
    };

    const result = await collection.insertOne(ticketData);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Ticket Confirmation #${ticketId}`,
      text: `Hi ${name},\n\nYour ticket has been created successfully!\n\nTicket ID: ${ticketId}\nDescription: ${description}\n\nThank you!`,
    });

    res.status(201).send({ message: 'Ticket created successfully!', ticketId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Failed to create ticket.' });
  }
});

// GET /api/admin/tickets
router.get('/admin/tickets', async (req, res) => {
  try {
      // const tickets = await getTickets(); // Replace with your DB logic
      const tickets = await db.collection('cluster0').find().toArray();

      res.json(tickets); // Respond with the tickets as JSON
  } catch (error) {
      console.error('Error fetching tickets:', error.message);
      res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

module.exports = router;
