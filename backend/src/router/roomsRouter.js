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
    testMessage: req.body?.testMessage,
    encryptedTestMessage: req.body?.encryptedTestMessage,
    roomName: req.body?.roomName,
    visibility: req.body?.visibility,
    ownerId: req.body?.ownerId || null,
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

    await db
      .collection("rooms")
      .updateOne({ _id: new ObjectId(idRoom) }, { $set: docNewRoom });

    const resGet = await getRoomInfo(idRoom);
    console.log("Room successfully updated", resGet.res);

    res.json(resGet.res);
  } catch (err) {
    console.error("Error creating room", err);
    res.status(500).send(err);
  }
});

// @TODO: refactor other queries to use this function. DRY
const getWithPagination = async (req, tableName) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const db = client.db(dbName);
    const docs = await db
      .collection(tableName)
      .find()
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return { res: docs.reverse(), err: null };
  } catch (err) {
    return { res: null, err };
  }
};

const injectRoomMetadata = async (db, data) => {
  try {
    // Get metadata for each room
    const pColl = db.collection("roomParticipants");
    const oColl = db.collection("roomOnlineUsers");

    const promisePList = data.map((roomDoc) =>
      pColl.countDocuments({ idRoom: String(roomDoc._id) })
    );
    const promiseOList = data.map((roomDoc) =>
      oColl.countDocuments({ idRoom: String(roomDoc._id) })
    );

    const pList = await Promise.all(promisePList);
    const oList = await Promise.all(promiseOList);

    const dataWithMetadata = data.map((roomDoc, index) => ({
      ...roomDoc,
      numParticipants: pList[index],
      numOnlineParticipants: oList[index],
    }));

    return dataWithMetadata;
  } catch (e) {
    return data;
  }
};

router.get("/", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);

    const opGet = await getWithPagination(req, "rooms");
    if (opGet.err) {
      res.status(500).send(opGet.err);
    }

    const data = opGet.res;
    const dataWithMetadata = await injectRoomMetadata(db, data);

    res.json(dataWithMetadata.reverse());
  } catch (e) {
    res.status(500).send(e);
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

    const dataWithMetadata = await injectRoomMetadata(db, docs);

    res.json(dataWithMetadata.reverse());
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/private-rooms/:idUser", async (req, res) => {
  const idUser = req.params.idUser;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    console.log("trying to match rooms with user", { idUser });
    await client.connect();
    const db = client.db(dbName);

    // Get rooms participant matches from the roomParticipants collection
    const roomParticipantDocs = await db
      .collection("roomParticipants")
      .find({ idUser: idUser })
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log("found participant rooms", roomParticipantDocs);

    // Map roomParticipantDocs to an array of idRoom for the next step
    const roomIdArray = roomParticipantDocs.map(
      (doc) => new ObjectId(doc.idRoom)
    );

    // Get the room info for each match
    const roomDocs = await db
      .collection("rooms")
      .find({ _id: { $in: roomIdArray } })
      .sort({ timestamp: 1 })
      .toArray();

    console.log("found rooms", roomDocs);

    res.json(roomDocs.reverse());
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
      .deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
