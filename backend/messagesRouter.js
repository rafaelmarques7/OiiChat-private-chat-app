const express = require("express");
const { ObjectId } = require("mongodb");
const { insertMessageToDb } = require("./lib");
const { client, dbName } = require("./config");
const router = express.Router();

// Create
router.post("/", async (req, res) => {
  try {
    const message = req.body;
    const result = await insertMessageToDb(message);
    res.json(result);
  } catch (err) {
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
      .collection("messages")
      .find()
      .sort({ timestamp: -1 })
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
    const doc = await db.collection("messages").findOne({ _id: ObjectId(id) });
    res.json(doc);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const message = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db
      .collection("messages")
      .updateOne({ _id: ObjectId(id) }, { $set: message });
    res.json(result);
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
      .collection("messages")
      .deleteOne({ _id: ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
