const { dbName, client } = require("../config");
const { ObjectId } = require("mongodb");

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
    return { data: result, err: null };
  } catch (err) {
    console.error("Error writing message to database", err);
    return { err };
  }
}

async function updateRoomParticipants(idRoom, userData) {
  try {
    console.log("trying to add participant to room: ", {
      idRoom,
      idUser: userData?._id,
    });

    const db = client.db(dbName);
    const doc = await db
      .collection("rooms")
      .findOne({ _id: new ObjectId(idRoom) });

    const idUser = userData._id;

    const updatedParticipantIds = doc.participantIds.includes(idUser)
      ? doc.participantIds
      : [...doc.participantIds, idUser];

    const updatedOnlineIds = doc.onlineParticipantIds.includes(idUser)
      ? doc.onlineParticipantIds
      : [...doc.onlineParticipantIds, idUser];

    const docNewRoom = {
      ...doc,
      participantIds: updatedParticipantIds,
      onlineParticipantIds: updatedOnlineIds,
    };

    await db
      .collection("rooms")
      .updateOne({ _id: new ObjectId(idRoom) }, { $set: docNewRoom });

    console.log("Room successfully updated");
    return { res: docNewRoom };
  } catch (err) {
    console.log("error adding user to room: ", err);
    return { err: err };
  }
}

async function updateRoomAfterUserDisconnect(idRoom, userData) {
  try {
    console.log("marking user as offline", idRoom, userData?._id);

    const db = client.db(dbName);
    const doc = await db
      .collection("rooms")
      .findOne({ _id: new ObjectId(idRoom) });

    const idUser = userData._id;

    const updatedOnlineIds = doc.onlineParticipantIds.filter(
      (id) => id !== idUser
    );

    const docNewRoom = {
      ...doc,
      onlineParticipantIds: updatedOnlineIds,
    };

    const result = await db
      .collection("rooms")
      .updateOne({ _id: new ObjectId(idRoom) }, { $set: docNewRoom });

    console.log("success marking user as offline");
    return { res: docNewRoom };
  } catch (err) {
    console.log("error removing online user from room: ", err);
    return { err };
  }
}

module.exports = {
  insertMessageToDb,
  updateRoomParticipants,
  updateRoomAfterUserDisconnect,
};
