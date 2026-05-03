const mongoose = require('mongoose');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const uri = env.split('\n').find(l => l.startsWith('MONGODB_URI=')).split('=')[1].trim();
mongoose.connect(uri).then(() => {
  console.log("SUCCESS");
  process.exit(0);
}).catch(e => {
  console.log("FAILED", e.message);
  process.exit(1);
});
