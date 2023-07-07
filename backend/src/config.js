const { MongoClient } = require("mongodb");

const URL_FRONTEND = "http://dq5rcunnxjcst.cloudfront.net/";

const URL_DB =
  process.env.URL_DATABASE ||
  "mongodb+srv://admin:rEOsy9NyorTqZDpJ@chatapp.bm2144p.mongodb.net/";

const client = new MongoClient(URL_DB);
const dbName = "ChatApp";

module.exports = {
  dbName,
  client,
  URL_FRONTEND,
};
