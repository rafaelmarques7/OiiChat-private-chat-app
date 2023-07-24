const express = require("express");
const { client, dbName } = require("../config");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("trying to get app stats");

  try {
    await client.connect();
    const db = client.db(dbName);
    const numUsers = await db.collection("users").countDocuments();
    const numMessages = await db.collection("messages").countDocuments();
    const numRooms = await db.collection("rooms").countDocuments();
    const numRoomsPublic = await db
      .collection("rooms")
      .countDocuments({ visibility: "public" });
    const numRoomsPrivate = await db
      .collection("rooms")
      .countDocuments({ visibility: "private" });
    const numOnlineUsers = await db
      .collection("roomOnlineUsers")
      .countDocuments();

    res.json({
      numUsers,
      numMessages,
      numRooms,
      numOnlineUsers,
      numRoomsPrivate,
      numRoomsPublic,
    });
  } catch (err) {
    console.log("user salt query error", err);
    res.status(500).send(err);
  }
});

module.exports = router;
