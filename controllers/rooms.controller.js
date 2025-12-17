const pool = require("../configure/db");

exports.listRoom = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms");
    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Database is empty" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("error fetching rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { room_number, category, price, beds } = req.body;

    if (!room_number)
      return res.status(400).json({ error: "room_number is required" });
    if (!category)
      return res.status(400).json({ error: "category is required" });
    if (price == null || price <= 0)
      return res.status(400).json({ error: "price must be > 0" });
    if (beds == null || beds <= 0)
      return res.status(400).json({ error: "beds must be > 0" });

    const result = await pool.query(
      "INSERT INTO rooms (room_number, category, price, beds) VALUES ($1, $2, $3, $4) RETURNING *",
      [room_number, category, price, beds]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "Room_number already exists" });
    }
    console.error("error creating room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
