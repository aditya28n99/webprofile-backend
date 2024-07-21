// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all projects
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM projects';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get a single project by ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM projects WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(result[0]);
  });
}); 

// Route to get a specific project by ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM projects WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(result[0]);
  });
});

// Create a new project
router.post('/', (req, res) => {
  const project = req.body;
  const sql = 'INSERT INTO projects SET ?';
  db.query(sql, project, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, ...project });
  });
});

// Update a project
router.put('/:id', (req, res) => {
  const { image_url, title, description, technologies, github_link, live_link } = req.body;
  const sql = 'UPDATE projects SET image_url = ?, title = ?, description = ?, technologies = ?, github_link = ?, live_link = ? WHERE id = ?';
  db.query(sql, [image_url, title, description, technologies, github_link, live_link, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ id: req.params.id, image_url, title, description, technologies, github_link, live_link });
  });
});

// Delete a project
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM projects WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(204).send();
  });
});

module.exports = router;
