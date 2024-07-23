const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM blog_posts');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a blog post
router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new blog post
router.post('/', async (req, res) => {
  const { title, subtitle, date, image_url, content } = req.body;
  try {
    const [results] = await db.query('INSERT INTO blog_posts (title, subtitle, date, image_url, content) VALUES (?, ?, ?, ?, ?)', [title, subtitle, date, image_url, content]);
    res.status(201).json({ id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a blog post
router.put('/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, subtitle, date, image_url, content } = req.body;
  try {
    const [results] = await db.query('UPDATE blog_posts SET title = ?, subtitle = ?, date = ?, image_url = ?, content = ? WHERE id = ?', [title, subtitle, date, image_url, content, postId]);
    res.json({ message: 'Blog post updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const [results] = await db.query('DELETE FROM blog_posts WHERE id = ?', [postId]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch likes for a post
router.get('/:id/likes', async (req, res) => {
  const postId = req.params.id;
  try {
    const [results] = await db.query('SELECT like_count FROM likes WHERE post_id = ?', [postId]);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update likes for a post
router.post('/:id/likes', async (req, res) => {
  const postId = req.params.id;
  try {
    await db.query('UPDATE likes SET like_count = like_count + 1 WHERE post_id = ?', [postId]);
    const [results] = await db.query('SELECT like_count FROM likes WHERE post_id = ?', [postId]);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch comments for a post
router.get('/:id/comments', async (req, res) => {
  const postId = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [postId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a comment to a post
router.post('/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const { comment, user_name } = req.body;
  try {
    await db.query('INSERT INTO comments (post_id, comment, user_name) VALUES (?, ?, ?)', [postId, comment, user_name]);
    const [results] = await db.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [postId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a comment for a post
router.put('/:id/comments/:commentId', async (req, res) => {
  const commentId = req.params.commentId;
  const { comment } = req.body;
  try {
    await db.query('UPDATE comments SET comment = ? WHERE id = ?', [comment, commentId]);
    res.json({ message: 'Comment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
