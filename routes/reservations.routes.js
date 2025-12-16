const express = require('express');
const router = express.Router();
const { createReservation, listReservations, listReservationsByRoom } = require('../controllers/reservations.controller');

router.get("/",listReservations)
router.get("/room/:roomId", listReservationsByRoom);
router.post("/",createReservation);

module.exports = router;
