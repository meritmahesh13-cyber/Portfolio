
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// File to store contacts
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// Helper to ensure contacts file exists
if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, '[]', 'utf8');
}

// Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create new contact object
        const newContact = {
            id: Date.now().toString(),
            name,
            email,
            message,
            date: new Date().toISOString()
        };

        // Read existing contacts
        const data = fs.readFileSync(CONTACTS_FILE, 'utf8');
        const contacts = JSON.parse(data);

        // Add new contact
        contacts.push(newContact);

        // Save back to file
        fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf8');

        console.log('New contact saved locally:', newContact);
        res.status(201).json({ message: 'Message sent successfully (Saved Locally)' });
    } catch (error) {
        console.error('Error saving contact:', error);
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
    console.log(`Saving contacts to: ${CONTACTS_FILE}`);
});
