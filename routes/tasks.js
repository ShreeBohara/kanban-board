// routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all tasks, optionally filter by column or search query
router.get('/', (req, res) => {
  const { column_id, q } = req.query;
  let query = 'SELECT * FROM tasks';
  const params = [];
  
  if (column_id) {
    query += ' WHERE column_id = ?';
    params.push(column_id);
  }
  if (q) {
    query += params.length ? ' AND' : ' WHERE';
    query += ' title LIKE ?';
    params.push(`%${q}%`);
  }
  query += ' ORDER BY position';
  
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create a new task
router.post('/', (req, res) => {
  const { title, description, column_id, position } = req.body;
  db.query(
    'INSERT INTO tasks (title, description, column_id, position) VALUES (?, ?, ?, ?)',
    [title, description || '', column_id, position || 0],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, title, description, column_id, position });
    }
  );
});

// Update a task (including moving it between columns or changing its order)
router.put('/:id', (req, res) => {
  const { title, description, column_id, position } = req.body;
  db.query(
    'UPDATE tasks SET title = ?, description = ?, column_id = ?, position = ? WHERE id = ?',
    [title, description, column_id, position, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ id: req.params.id, title, description, column_id, position });
    }
  );
});

// Delete a task
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task deleted' });
  });
});

module.exports = router;
