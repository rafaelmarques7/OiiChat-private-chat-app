const { MongoClient } = require("mongodb");

const URL_FRONTEND = "http://dq5rcunnxjcst.cloudfront.net/";

const URL_DB =
  "mongodb+srv://admin:rEOsy9NyorTqZDpJ@chatapp.bm2144p.mongodb.net/";
// process.env.URL_DATABASE ||

const client = new MongoClient(URL_DB);
const dbName = "ChatApp";

module.exports = {
  dbName,
  client,
  URL_FRONTEND,
};
