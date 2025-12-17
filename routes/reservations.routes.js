const express = require('express');
const router = express.Router();
const { createReservation, listReservations, listReservationsByRoom, deleteReservation, updateReservation} = require('../controllers/reservations.controller');

router.get("/",listReservations)
router.get("/room/:roomId", listReservationsByRoom);
router.post("/",createReservation);
router.delete("/:id", deleteReservation);
router.put("/:id",updateReservation);

module.exports = router;
