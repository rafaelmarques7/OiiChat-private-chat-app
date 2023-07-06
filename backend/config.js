const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
// "mongodb+srv://admin:rEOsy9NyorTqZDpJ@chatapp.bm2144p.mongodb.net/";
const client = new MongoClient(url);
const dbName = "ChatApp";

module.exports = {
  dbName,
  client,
};
