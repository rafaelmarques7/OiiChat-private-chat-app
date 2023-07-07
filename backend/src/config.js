const { MongoClient } = require("mongodb");

const url = process.env.URL_DATABASE;
//  "mongodb://localhost:27017";
// "mongodb+srv://admin:rEOsy9NyorTqZDpJ@chatapp.bm2144p.mongodb.net/";
const client = new MongoClient(url);
const dbName = process.env.DB_NAME;

module.exports = {
  dbName,
  client,
};
