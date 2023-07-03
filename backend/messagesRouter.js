// messagesRouter.js

const express = require("express");
const mongojs = require("mongojs");
const router = express.Router();

const db = mongojs("mongodb://localhost:27017/ChatApp", ["messages"]);

// Create
router.post("/", (req, res) => {
  const message = req.body;
  db.messages.insert(message, (err, doc) => {
    if (err) return res.status(500).send(err);
    res.json(doc);
  });
});

// Read all with pagination
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  db.messages
    .find()
    .skip(skip)
    .limit(limit, (err, docs) => {
      if (err) return res.status(500).send(err);
      res.json(docs);
    });
});

// Read one
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.messages.findOne({ _id: mongojs.ObjectId(id) }, (err, doc) => {
    if (err) return res.status(500).send(err);
    res.json(doc);
  });
});

// Update
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const message = req.body;
  db.messages.update(
    { _id: mongojs.ObjectId(id) },
    { $set: message },
    (err, doc) => {
      if (err) return res.status(500).send(err);
      res.json(doc);
    }
  );
});

// Delete
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.messages.remove({ _id: mongojs.ObjectId(id) }, (err, doc) => {
    if (err) return res.status(500).send(err);
    res.json(doc);
  });
});

module.exports = router;
