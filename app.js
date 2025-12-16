const express = require('express');

const app = express();
app.use(express.json());

const pool = require('./db');

app.get('/', (req, res) => {
  res.json({ message: 'Room Booking API running' });
});



app.get('/db-test', async (req, res) => {
  const result = await pool.query('SELECT 1');
  res.json(result.rows);
});

module.exports = app;