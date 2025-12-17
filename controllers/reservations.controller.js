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
};

exports.createReservation = async (req, res) => {
  try {
    const { room_id, guest_name, check_in, check_out } = req.body;

    //Required field validation
    const missingField = ["room_id", "guest_name", "check_in", "check_out"]
      .find(field => req.body[field] === undefined);

    if (missingField) {
      return res
        .status(400)
        .json({ error: `${missingField} is required` });
    }

    // Date validation
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        error: "check_out must be after check_in"
      });
    }

    //Ensure room exists
    const roomExists = await pool.query(
      "SELECT id FROM rooms WHERE id = $1",
      [room_id]
    );

    if (roomExists.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Overlap check 
    const overlap = await pool.query(
      `SELECT 1 FROM reservations
       WHERE room_id = $1
       AND check_in < $3
       AND check_out > $2`,
      [room_id, checkInDate, checkOutDate]
    );

    if (overlap.rows.length > 0) {
      return res.status(409).json({
        message: "Room is already booked for the selected dates"
      });
    }

    // Create reservation
    const result = await pool.query(
      `INSERT INTO reservations (room_id, guest_name, check_in, check_out)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [room_id, guest_name, checkInDate, checkOutDate]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("error creating reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.listReservationsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const result = await pool.query(
      "SELECT * FROM reservations WHERE room_id = $1",
      [roomId]
    );

    if (result.rows.length === 0) {
      return res
        .status(200)
        .json({ message: "No reservations found for this room" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("error fetching reservations by room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM reservations WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully", reservation: result.rows[0] });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_id, guest_name, check_in, check_out } = req.body;

    // At least one field must be provided
    if (!room_id && !guest_name && !check_in && !check_out) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    // Date validation if provided
    let checkInDate = check_in ? new Date(check_in) : null;
    let checkOutDate = check_out ? new Date(check_out) : null;

    if ((check_in && isNaN(checkInDate)) || (check_out && isNaN(checkOutDate))) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (checkInDate && checkOutDate && checkInDate >= checkOutDate) {
      return res.status(400).json({ error: "check_out must be after check_in" });
    }

    // Optional: Check overlapping reservations only if dates or room_id change
    if (room_id || check_in || check_out) {
      const overlapCheck = await pool.query(
        `SELECT 1 FROM reservations
         WHERE id != $1
           AND room_id = COALESCE($2, room_id)
           AND check_in < COALESCE($4, check_out)
           AND check_out > COALESCE($3, check_in)`,
        [id, room_id, checkInDate, checkOutDate]
      );

      if (overlapCheck.rows.length > 0) {
        return res.status(409).json({ error: "Room is already booked for the selected dates" });
      }
    }

    const result = await pool.query(
      `UPDATE reservations
       SET room_id = COALESCE($2, room_id),
           guest_name = COALESCE($3, guest_name),
           check_in = COALESCE($4, check_in),
           check_out = COALESCE($5, check_out)
       WHERE id = $1
       RETURNING *`,
      [id, room_id, guest_name, checkInDate, checkOutDate]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation updated successfully", reservation: result.rows[0] });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

