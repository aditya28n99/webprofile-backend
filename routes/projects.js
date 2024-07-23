const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM projects');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single project by ID
router.get('/:id', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  const project = req.body;
  try {
    const [result] = await db.query('INSERT INTO projects SET ?', project);
    res.status(201).json({ id: result.insertId, ...project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  const { image_url, title, description, technologies, github_link, live_link } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE projects SET image_url = ?, title = ?, description = ?, technologies = ?, github_link = ?, live_link = ? WHERE id = ?',
      [image_url, title, description, technologies, github_link, live_link, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ id: req.params.id, image_url, title, description, technologies, github_link, live_link });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
