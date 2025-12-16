const pool = require("../configure/db");

exports.listReservations = async (req, res) => { 
    try {
        const result = await pool.query("SELECT * FROM reservations");
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "Database is empty" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("error fetching reservations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.createReservation = async (req, res) => {
    try {
        const { room_id, guest_name, check_in, check_out } = req.body;  
        
        if (!room_id || !guest_name || !check_in || !check_out) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        if (checkInDate >= checkOutDate) {
            return res.status(400).json({ error: "Check-out date must be after check-in date" });
        }

        // Check for overlapping reservations
        const overlapCheck = await pool.query(
            "SELECT * FROM reservations WHERE room_id = $1 AND check_in < $3 AND check_out > $2",
            [room_id, checkInDate, checkOutDate]
        );

        if (overlapCheck.rows.length > 0) {
            return res.status(400).json({ error: "Room is already booked for the selected dates" });
        }

        const result = await pool.query(
            "INSERT INTO reservations (room_id, guest_name, check_in, check_out) VALUES ($1, $2, $3, $4) RETURNING *",
            [room_id, guest_name, checkInDate, checkOutDate]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("error creating reservation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }   
}

exports.listReservationsByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const result = await pool.query("SELECT * FROM reservations WHERE room_id = $1", [roomId]);
        
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No reservations found for this room" });
        }
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("error fetching reservations by room:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

