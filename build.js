const fs = require('fs');
require('dotenv').config();

// Read the template HTML
const template = fs.readFileSync('index.html', 'utf8');

// Replace environment variables
const html = template.replace(
    '<%- process.env.NASA_API_KEY %>',
    process.env.NASA_API_KEY || ''
);

// Write the processed file
fs.writeFileSync('dist/index.html', html); 