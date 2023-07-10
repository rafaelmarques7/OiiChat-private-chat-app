const express = require("express");
const { ObjectId } = require("mongodb");
const { client, dbName } = require("../config");
const { getRoomInfo } = require("../utils/lib");
const router = express.Router();

// Create
router.post("/create-room", async (req, res) => {
  if (!req.body.roomName || !req.body.visibility) {
    res.status(400).send("Missing parameters roomName or visibility");
    return;
  }

  const newRoom = {
    roomName: req.body.roomName,
    visibility: req.body.visibility,
    ownerId: req.body.ownerId || null,
    timestamp: Date.now(),
  };

  try {
    console.log("trying to create a new room");
    const db = client.db(dbName);

    const result = await db.collection("rooms").insertOne(newRoom);
    console.log("New room successfully created: ", result?.insertedId);

    res.json({
      _id: result.insertedId,
      ...newRoom,
    });
  } catch (err) {
    console.error("Error creating room", err);
    res.status(500).send(err);
  }
});

// Use this endpoint to update Room
router.put("/:idRoom", async (req, res) => {
  try {
    const idRoom = req.params.idRoom;
    const { roomName, visibility } = req.body;

    console.log("trying to update room info", { idRoom, roomName, visibility });

    const db = client.db(dbName);
    const doc = await db
      .collection("rooms")
      .findOne({ _id: new ObjectId(idRoom) });

    const docNewRoom = {
      ...doc,
      roomName: roomName ? roomName : doc?.roomName,
      visibility: visibility ? visibility : doc?.visibility,
    };

    const result = await db
      .collection("rooms")
      .updateOne({ _id: new ObjectId(idRoom) }, { $set: docNewRoom });

    console.log("Room successfully updated");

    res.json(docNewRoom);
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

router.get("/public-rooms", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const db = client.db(dbName);
    const docs = await db
      .collection("rooms")
      .find({ visibility: "public" })
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    res.json(docs.reverse());
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/private-rooms/:idUser", async (req, res) => {
  const idUser = req.params.idUser;

  try {
    console.log("trying to match rooms with user", { idUser });
    await client.connect();
    const db = client.db(dbName);
    const docs = await db
      .collection("rooms")
      .find({ participantIds: { $in: [idUser] } })
      .sort({ timestamp: 1 })
      .toArray();
    console.log("found rooms", docs);
    res.json(docs.reverse());
  } catch (err) {
    res.status(500).send(err);
  }
});

// Read one
router.get("/:id", async (req, res) => {
  const opRes = await getRoomInfo(req.params.id);

  if (opRes.res) {
    console.log("in success", opRes.res);
    res.status(200).send(opRes.res);
  } else {
    console.log("in error", opRes.err);
    res.status(500).send(opRes.err);
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
