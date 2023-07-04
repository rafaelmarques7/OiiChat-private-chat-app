const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "ChatApp";

async function insertMessage(message) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("messages").insertOne(message);
    console.log("Message written to database: ", result.ops[0]);
    return result.ops[0];
  } catch (err) {
    console.error("Error writing message to database", err);
    throw err;
  } finally {
    await client.close();
  }
}

// Create
router.post("/", async (req, res) => {
  try {
    const message = req.body;
    const result = await insertMessage(message);
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
  } finally {
    await client.close();
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
  } finally {
    await client.close();
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
  } finally {
    await client.close();
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
  } finally {
    await client.close();
  }
});

module.exports = router;
