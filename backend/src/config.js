const { MongoClient } = require("mongodb");

const USE_CONFIG = process.env.USE_CONFIG || "prod";
console.log("backend using config: ", USE_CONFIG);

const ALLOWED_ORIGINS =
  USE_CONFIG === "dev"
    ? "http://localhost:3000"
    : [
        "http://dq5rcunnxjcst.cloudfront.net",
        "https://dq5rcunnxjcst.cloudfront.net",
        "https://oiichat.net",
        "https://www.oiichat.net",
      ];

const URL_DB =
  USE_CONFIG === "dev"
    ? "mongodb://localhost:27017"
    : "mongodb+srv://admin:rEOsy9NyorTqZDpJ@chatapp.bm2144p.mongodb.net/";

const client = new MongoClient(URL_DB);
const dbName = "ChatApp";

module.exports = {
  dbName,
  client,
  ALLOWED_ORIGINS,
};
