// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const projects = require('./routes/projects');
const blogRoutes = require('./routes/blogroutes');

require('dotenv').config(); // Load environment variables from .env file

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define a route handler for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to your portfolio website!');
});

// Use the projects route handler
app.use('/projects', projects);
app.use('/blogs', blogRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

