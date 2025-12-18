const express = require('express');
const router = express.Router();
const {createRoom , listRoom, deleteRoom, updateRoom } = require('../controllers/rooms.controller');

router.get("/",listRoom);
router.post("/",createRoom);
router.delete("/:id",deleteRoom);
router.patch("/:id",updateRoom);

module.exports = router;