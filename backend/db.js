const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection URI
const uri = process.env.MONGO_URI; // Store your connection string in .env

// Create a new MongoClient instance
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

module.exports = { client, connect };
