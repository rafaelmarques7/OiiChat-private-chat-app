const express = require("express");
const { ObjectId } = require("mongodb");
const { client, dbName } = require("../config");
const router = express.Router();

router.post("/sign-up", async (req, res) => {
  try {
    console.log("trying to create a new user");
    const db = client.db(dbName);

    const payload = {
      ...req.body,
      vault: [],
    };

    const op = await db.collection("users").insertOne(payload);
    const doc = await db.collection("users").findOne({ _id: op.insertedId });

    console.log("New user successfully created: ", doc);
    res.json(doc);
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).send(err);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    console.log("trying to get user");
    await client.connect();
    const db = client.db(dbName);
    const doc = await db.collection("users").findOne({ ...req.body });
    console.log("user found", doc._id);
    if (!doc) {
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

    // Find user
    const doc = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return res.status(404).send("User not found");
    }

    // Fetch room information for each idRoom in the vault
    const updatedVault = await Promise.all(
      doc.vault.map(async (vaultItem) => {
        const room = await db
          .collection("rooms")
          .findOne({ _id: new ObjectId(vaultItem.idRoom) });
        if (room) {
          return {
            ...vaultItem,
            roomName: room.roomName,
          };
        }
        return vaultItem;
      })
    );

    doc.vault = updatedVault;

    res.json(doc);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/:id/add-to-vault", async (req, res) => {
  const id = req.params.id;
  const { idRoom, passwordRoom } = req.body;

  try {
    console.log("trying to add to user vault", { id });
    await client.connect();
    const db = client.db(dbName);

    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $push: { vault: { idRoom, passwordRoom } } }
      );

    // Retrieve updated document
    const updatedDoc = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    res.json(updatedDoc);
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
      .deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
