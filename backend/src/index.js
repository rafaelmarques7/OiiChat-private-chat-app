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
  updateRoomAfterUserDisconnect,
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

app.use(cors());
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

  // join room
  socket.on("joinRoom", (idRoom, userData) => {
    socket.join(idRoom);
    console.log("user joined room: ", { idRoom, userData });

    if (userData && userData.username) {
      updateRoomParticipants(idRoom, userData);
    }
  });

  socket.on("eventRoomLeave", (idRoom, userData) => {
    socket.join(idRoom);
    console.log("user left room: ", { idRoom, userData });

    if (userData && userData.username) {
      updateRoomAfterUserDisconnect(idRoom, userData);
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
