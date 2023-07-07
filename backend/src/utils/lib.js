const { dbName, client } = require("../config");

async function insertMessageToDb(message, idRoom) {
  const doc = {
    ...message,
    idRoom,
  };

  try {
    console.log("trying to insert message to db", { doc });
    const db = client.db(dbName);

    const result = await db.collection("messages").insertOne(doc);
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
