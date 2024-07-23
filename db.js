// backend/db.js
require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(process.env.CA)
  },
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your needs
  queueLimit: 0
});

pool.on('connection', (connection) => {
  console.log('Connected to MySQL');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = pool.promise();
