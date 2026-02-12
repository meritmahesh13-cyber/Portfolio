// Fix DNS resolution issues by using Cloudflare DNS
const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']); // Cloudflare DNS

require('dotenv').config();
const mongoose = require('mongoose');

console.log('=== MongoDB Connection Test ===');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('Attempting to connect...\n');

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10 second timeout
})
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        console.log('Connection state:', mongoose.connection.readyState);
        console.log('Database name:', mongoose.connection.name);
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Failed:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error code:', err.code);
        console.error('\nFull error:', err);
        process.exit(1);
    });
