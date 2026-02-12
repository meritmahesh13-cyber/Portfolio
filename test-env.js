require('dotenv').config();

console.log('=== Environment Variable Test ===');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);
console.log('Full MONGO_URI:', process.env.MONGO_URI);
console.log('================================');
