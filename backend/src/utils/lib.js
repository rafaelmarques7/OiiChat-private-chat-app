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

async function updateParticipantsColl(collName, idRoom, userData) {
  try {
    const idUser = String(userData._id);
    console.log("trying to update coll: ", {
      collName,
      idRoom,
      idUser,
    });

    // check if a doc already exists, and if so do nothing
    const db = client.db(dbName);
    const doc = await db.collection(collName).findOne({
      $and: [{ idRoom: idRoom }, { idUser: idUser }],
    });

    if (doc) {
      console.log("user already exists in participants collection");
      return { res: doc };
    } else {
      console.log("did not find user", doc);
    }

    // get user details
    const userDoc = await db
      .collection("users")
      .findOne({ _id: new ObjectId(idUser) });

    // create new doc in roomParticipants collection
    const newDoc = {
      idRoom,
      timestamp: Date.now(),
      idUser: idUser,
      username: userDoc.username,
    };

    const res = await db.collection(collName).insertOne(newDoc);

    console.log(`User added to ${collName} collection`);
    return { res };
  } catch (err) {
    console.log(`error adding user to ${collName} collection: ${err}`);
    return { err: err };
  }
}

async function updateRoomOnlineUsers(idRoom, userData) {
  const { res, err } = await updateParticipantsColl(
    "roomOnlineUsers",
    idRoom,
    userData
  );

  return { res, err };
}

async function updateRoomParticipants(idRoom, userData) {
  const { res, err } = await updateParticipantsColl(
    "roomParticipants",
    idRoom,
    userData
  );

  return { res, err };
}

async function removeRoomOnlineUsers(idRoom, userData) {
  try {
    console.log("marking user as offline", idRoom, userData?._id);

    const dbPayload = { idRoom: idRoom, idUser: userData._id };

    const db = client.db(dbName);
    const doc = await db.collection("roomOnlineUsers").findOne(dbPayload);

    if (!doc) {
      console.log("user not found in roomOnlineUsers collection");
    }

    await db.collection("roomOnlineUsers").deleteOne(dbPayload);

    console.log("user removed from roomOnlineUsers collection");
    return { res: true };
  } catch (err) {
    console.log("error removing online user from room: ", err);
    return { err };
  }
}

async function getRoomInfo(idRoom) {
  try {
    console.log("trying to get room info", { idRoom });
    await client.connect();
    const db = client.db(dbName);

    const roomCollection = db.collection("rooms");
    const participantCollection = db.collection("roomParticipants");
    const onlineUsersCollection = db.collection("roomOnlineUsers");

    const roomQuery = roomCollection.findOne({ _id: new ObjectId(idRoom) });
    const participantsQuery = participantCollection.find({ idRoom }).toArray();
    const onlineUsersQuery = onlineUsersCollection.find({ idRoom }).toArray();

    const [roomDoc, participantsDocs, onlineUsersDocs] = await Promise.all([
      roomQuery,
      participantsQuery,
      onlineUsersQuery,
    ]);

    return {
      res: {
        ...roomDoc,
        participants: participantsDocs,
        onlineUsers: onlineUsersDocs,
      },
    };
  } catch (err) {
    return { err };
  }
}

module.exports = {
  insertMessageToDb,
  updateRoomParticipants,
  removeRoomOnlineUsers,
  updateRoomOnlineUsers,
  getRoomInfo,
};
