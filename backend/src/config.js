const { MongoClient } = require("mongodb");

const url = process.env.URL_DATABASE;
const client = new MongoClient(url);
const dbName = "ChatApp";

module.exports = {
  dbName,
  client,
};
