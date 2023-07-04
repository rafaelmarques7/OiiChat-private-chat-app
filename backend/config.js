const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "ChatApp";

module.exports = {
  dbName,
  client,
};
