// routes/columns.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all columns ordered by position
router.get('/', (req, res) => {
  db.query('SELECT * FROM columns ORDER BY position', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create a new column
router.post('/', (req, res) => {
  const { title, position } = req.body;
  db.query('INSERT INTO columns (title, position) VALUES (?, ?)', [title, position || 0], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, title, position });
  });
});

// Update a column title or position
router.put('/:id', (req, res) => {
  const { title, position } = req.body;
  db.query('UPDATE columns SET title = ?, position = ? WHERE id = ?', [title, position, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ id: req.params.id, title, position });
  });
});

// Delete a column
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM columns WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Column deleted' });
  });
});

module.exports = router;
