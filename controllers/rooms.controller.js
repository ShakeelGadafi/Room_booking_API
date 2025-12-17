const pool = require("../configure/db");

exports.listRoom = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms ORDER BY id ASC");
    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Database is empty" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { room_number, category, price, beds } = req.body;

    // Required field validation
    const missingField = ["room_number", "category", "price", "beds"].find(
      (field) => req.body[field] === undefined
    );

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` });
    }

    // Type & value validation
    if (typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json({ message: "price must be a positive number" });
    }

    if (typeof beds !== "number" || beds <= 0) {
      return res
        .status(400)
        .json({ message: "beds must be a positive number" });
    }
    //Prevent duplicate room_number
    const existingRoom = await pool.query(
      "SELECT * FROM rooms WHERE room_number = $1",
      [room_number]
    );
    if (existingRoom.rows.length > 0) {
      return res.status(400).json({ message: "Room_number already exists" });
    }

    // Insert room
    const result = await pool.query(
      "INSERT INTO rooms (room_number, category, price, beds) VALUES ($1, $2, $3, $4) RETURNING *",
      [room_number, category, price, beds]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Handle duplicate room_number
    if (error.code === "23505") {
      return res.status(400).json({ message: "Room_number already exists" });
    }

    console.error("Error creating room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM rooms WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res
      .status(200)
      .json({ message: "Room deleted successfully", room: result.rows[0] });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_number, category, price, beds } = req.body;

    // Required fields validation (optional: only if you want full replacement)
    if (!room_number && !category && price === undefined && beds === undefined) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    // Type validation
    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      return res.status(400).json({ message: "price must be a positive number" });
    }

    if (beds !== undefined && (typeof beds !== "number" || beds <= 0)) {
      return res.status(400).json({ message: "beds must be a positive number" });
    }

    const result = await pool.query(
      `UPDATE rooms
       SET room_number = COALESCE($1, room_number),
           category = COALESCE($2, category),
           price = COALESCE($3, price),
           beds = COALESCE($4, beds)
       WHERE id = $5
       RETURNING *`,
      [room_number, category, price, beds, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room updated successfully", room: result.rows[0] });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

