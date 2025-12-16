const express = require("express");

const app = express();
app.use(express.json());

const pool = require("./configure/db");

app.use("/rooms", require("./routes/rooms.routes"));

app.use("/reservations", require("./routes/reservations.routes"));

module.exports = app;
