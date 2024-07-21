const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all blogs
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM blog_posts';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Fetch a blog post
router.get('/:id', (req, res) => {
  const postId = req.params.id;
  db.query('SELECT * FROM blog_posts WHERE id = ?', [postId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Create a new blog post
router.post('/', (req, res) => {
  const { title, date, image_url, content } = req.body;
  const sql = 'INSERT INTO blog_posts (title, date, image_url, content) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, date, image_url, content], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId });
  });
});

// Update a blog post
router.put('/:id', (req, res) => {
  const postId = req.params.id;
  const { title, date, image_url, content } = req.body;
  const sql = 'UPDATE blog_posts SET title = ?, date = ?, image_url = ?, content = ? WHERE id = ?';
  db.query(sql, [title, date, image_url, content, postId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Blog post updated successfully' });
  });
});

// Delete a blog post
router.delete('/:id', (req, res) => {
  const postId = req.params.id;
  const sql = 'DELETE FROM blog_posts WHERE id = ?';
  db.query(sql, [postId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Blog post deleted successfully' });
  });
});

// Fetch likes for a post
router.get('/:id/likes', (req, res) => {
  const postId = req.params.id;
  db.query('SELECT like_count FROM likes WHERE post_id = ?', [postId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Update likes for a post
router.post('/:id/likes', (req, res) => {
  const postId = req.params.id;
  db.query('UPDATE likes SET like_count = like_count + 1 WHERE post_id = ?', [postId], (err, results) => {
    if (err) return res.status(500).send(err);
    db.query('SELECT like_count FROM likes WHERE post_id = ?', [postId], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results[0]);
    });
  });
});

// Fetch comments for a post
router.get('/:id/comments', (req, res) => {
  const postId = req.params.id;
  db.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [postId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a comment to a post
router.post('/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { comment, user_name } = req.body;
  db.query('INSERT INTO comments (post_id, comment, user_name) VALUES (?, ?, ?)', [postId, comment, user_name], (err, results) => {
    if (err) return res.status(500).send(err);
    db.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [postId], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });
});

// Update a comment for a post
router.put('/:id/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const { comment } = req.body;
  db.query('UPDATE comments SET comment = ? WHERE id = ?', [comment, commentId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Comment updated successfully' });
  });
});

module.exports = router;
