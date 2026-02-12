
// Fix DNS resolution issues by using Cloudflare DNS
const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']); // Cloudflare DNS

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/Contact');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
// Use the environment variable for the URI
// In Render, you must set MONGO_URI in the "Environment Variables" section of your dashboard.
if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI is not defined. Please check your .env file or Render environment variables.");
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
        // On local machine with bad network, this might fail, but it should work on Render
    });

// Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newContact = new Contact({
            name,
            email,
            message,
        });

        await newContact.save();

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fallback route to serve index.html
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
