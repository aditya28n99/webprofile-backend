// backend/db.js
require('dotenv').config();

const mysql = require('mysql2');

const fs = require('fs');
const dotenv = require('dotenv');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
  ca: fs.readFileSync(process.env.CA)
  }
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = db;
