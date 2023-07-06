const express = require("express");
const { ObjectId } = require("mongodb");
const { insertMessageToDb } = require("./lib");
const { client, dbName } = require("./config");
const router = express.Router();

// Create
router.post("/create-room", async (req, res) => {
  const newRoom = {
    timestamp: Date.now(),
  };

  try {
    console.log("trying to create a new room");
    const db = client.db(dbName);

    const result = await db.collection("rooms").insertOne(newRoom);
    console.log("New room successfully created: ", result);

    res.json({
      _id: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating room", err);
    res.status(500).send(err);
  }
});

// Read all with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const db = client.db(dbName);
    const docs = await db
      .collection("rooms")
      .find()
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    res.json(docs.reverse());
  } catch (err) {
    res.status(500).send(err);
  }
});

// Read one
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await client.connect();
    const db = client.db(dbName);
    const doc = await db.collection("rooms").findOne({ _id: ObjectId(id) });
    res.json(doc);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Delete
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db
      .collection("rooms")
      .deleteOne({ _id: ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
