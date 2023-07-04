const { dbName, client } = require("./config");

async function insertMessageToDb(message) {
  console.log("trying to insert message to db", { message });
  try {
    const db = client.db(dbName);
    const result = await db.collection("messages").insertOne(message);
    console.log("Message written to database: ", result);

    // console.log("Message written to database: ", result.ops[0]);
    return result;
  } catch (err) {
    console.error("Error writing message to database", err);
    throw err;
  }
}

module.exports = {
  insertMessageToDb,
};
