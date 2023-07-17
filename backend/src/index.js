// Configure env variables
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
  insertMessageToDb,
  updateRoomParticipants,
  updateRoomOnlineUsers,
  getRoomInfo,
  removeRoomOnlineUsers,
} = require("./utils/lib");
const { ALLOWED_ORIGINS } = require("./config");

const messagesRouter = require("./router/messagesRouter");
const roomsRouter = require("./router/roomsRouter");
const usersRouter = require("./router/usersRouter");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
  },
});

const corsOptions = {
  origin: ALLOWED_ORIGINS,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/messages", messagesRouter);
app.use("/rooms", roomsRouter);
app.use("/users", usersRouter);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("joinRoom", async (idRoom, userData) => {
    socket.join(idRoom);
    console.log("user joined room: ", { idRoom, userData });

    if (userData && userData._id) {
      // update room participants
      const promiseOne = updateRoomParticipants(idRoom, userData);
      const promiseTwo = updateRoomOnlineUsers(idRoom, userData);
      await Promise.all([promiseOne, promiseTwo]);

      // return latest room document
      const { res } = await getRoomInfo(idRoom);
      if (res) {
        console.log("emitting eventNewRoomInfo", res);
        socket.to(idRoom).emit("eventNewRoomInfo", res);
      }
    }
  });

  socket.on("eventRoomLeave", async (idRoom, userData) => {
    socket.join(idRoom);
    console.log("user left room: ", { idRoom, userData });

    if (userData && userData._id) {
      await removeRoomOnlineUsers(idRoom, userData);

      // return latest room document
      const { res } = await getRoomInfo(idRoom);
      if (res) {
        console.log("emitting eventNewRoomInfo");
        socket.to(idRoom).emit("eventNewRoomInfo", res);
      }
    }
  });

  socket.on("eventStartTyping", ({ idRoom, username }) => {
    console.log("received eventStartTyping: ", { idRoom, username });

    socket.to(idRoom).emit("eventStartTyping", username);
  });

  socket.on("eventStopTyping", ({ idRoom, username }) => {
    console.log("received eventStopTyping: ", { idRoom, username });

    socket.to(idRoom).emit("eventStopTyping", username);
  });

  socket.on("eventChatMessage", async (msg, idRoom) => {
    console.log("received eventChatMessage: ", msg, idRoom);

    // Write the message to the database
    try {
      console.log("writing message to database");
      await insertMessageToDb(msg, idRoom);

      console.log("broadcasting eventChatMessage to room: ", idRoom);
      io.to(idRoom).emit("eventChatMessage", msg);
    } catch (err) {
      console.error("Error writing message to database", err);
      return;
    }
  });
});

server.listen(5001, () => {
  console.log("listening on http://localhost:5001");
});
