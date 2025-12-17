const express = require('express');
const router = express.Router();
const {createRoom , listRoom, deleteRoom} = require('../controllers/rooms.controller');

router.get("/",listRoom);
router.post("/",createRoom);
router.delete("/:id",deleteRoom);

module.exports = router;