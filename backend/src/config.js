const { MongoClient } = require("mongodb");

const USE_CONFIG = "prod"; // "dev";

const URL_FRONTEND =
  USE_CONFIG === "dev"
    ? "http://localhost:3000"
    : "http://dq5rcunnxjcst.cloudfront.net";

const URL_DB =
  USE_CONFIG === "dev"
    ? "mongodb://localhost:27017"
    : "mongodb+srv://admin:rEOsy9NyorTqZDpJ@chatapp.bm2144p.mongodb.net/";
// process.env.URL_DATABASE ||

const client = new MongoClient(URL_DB);
const dbName = "ChatApp";

module.exports = {
  dbName,
  client,
  URL_FRONTEND,
};
