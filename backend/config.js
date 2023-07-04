const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:rEOsy9NyorTqZDpJ@chatapp.bm2144p.mongodb.net/"; //  "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "ChatApp";

module.exports = {
  dbName,
  client,
};
