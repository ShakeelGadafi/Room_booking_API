const express = require('express');

const app = express();
app.use(express.json());

const pool = require('./configure/db');

// app.get('/', (req, res) => {
//   res.json({ message: 'Room Booking API running' });
// });



// app.get('/db-test', async (req, res) => {
//   const result = await pool.query('SELECT 1');
//   res.json(result.rows);
// });

app.use('/rooms', require('./routes/rooms.routes'));

app.use('/reservation',require('./routes/reservations.routes'));


module.exports = app;