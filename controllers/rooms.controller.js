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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createRoom = async (req, res) => {
  try{
  const {room_number, category, price, beds}= req.body;

  if (!room_number || !category || price == null || beds == null) {
      return res.status(400).json({ error: 'All fields are required' });
  }  

  if(price<=0){
     return res.status(400).json({message:"Price cannot be negative"});
  }

  if(beds<=0){
     return res.status(400).json({message:"Beds cannot be negative"});
  }
  const result = await pool.query(
      'INSERT INTO rooms (room_number, category, price, beds) VALUES ($1, $2, $3, $4) RETURNING *',
      [room_number, category, price, beds]
  );
  res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("error creating room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
