const express = require('express');
const router = express.Router();
const {createRoom , listRoom} = require('../controllers/rooms.controller');

router.get("/",listRoom);

router.post("/",createRoom);

module.exports = router;