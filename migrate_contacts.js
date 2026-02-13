const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const Contact = require('./models/Contact');
const dns = require('dns');

// Set DNS servers as we did in server.js
dns.setServers(['1.1.1.1', '1.0.0.1']);

async function migrateData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for migration...');

        const rawData = fs.readFileSync('contacts.json');
        const contacts = JSON.parse(rawData);

        console.log(`Found ${contacts.length} contacts in contacts.json`);

        for (const contactData of contacts) {
            // Check if contact already exists (by name and email to avoid duplicates)
            const exists = await Contact.findOne({
                name: contactData.name,
                email: contactData.email,
                message: contactData.message
            });

            if (!exists) {
                const newContact = new Contact({
                    name: contactData.name,
                    email: contactData.email,
                    message: contactData.message,
                    date: contactData.date ? new Date(contactData.date) : new Date()
                });
                await newContact.save();
                console.log(`Migrated: ${contactData.name}`);
            } else {
                console.log(`Skipped (already exists): ${contactData.name}`);
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed with error:', error);
        console.error('Error stack:', error.stack);
        process.exit(1);
    }
}

migrateData();
