const express = require("express");
const { ObjectId } = require("mongodb");
const { client, dbName } = require("../config");
const router = express.Router();

router.post("/sign-up", async (req, res) => {
  const _id = new ObjectId();

  try {
    console.log("trying to create a new user");
    const db = client.db(dbName);

    const result = await db.collection("users").insertOne(req.body);
    console.log("New user successfully created: ", result);

    res.json({
      _id: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).send(err);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    console.log("trying to get user", { params: req.body });
    await client.connect();
    const db = client.db(dbName);
    const doc = await db
      .collection("users")
      .find({ ...req.body })
      .toArray();
    console.log("doc", doc);
    if (!doc.length) {
      res.status(404).send("User not found");
    } else {
      res.json(doc);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    console.log("trying to get user", { id });
    await client.connect();
    const db = client.db(dbName);
    const doc = await db.collection("users").findOne({ _id: new ObjectId(id) });
    res.json(doc);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db
      .collection("users")
      .deleteOne({ _id: ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
