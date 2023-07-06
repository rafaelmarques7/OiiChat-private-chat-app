const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const messagesRouter = require("./messagesRouter");
const roomsRouter = require("./roomsRouter");

const { insertMessageToDb } = require("./lib");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    // "http://dq5rcunnxjcst.cloudfront.net",
  },
});

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/messages", messagesRouter);
app.use("/rooms", roomsRouter);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // join room
  socket.on("join", (room) => {
    socket.join(room);
    console.log("user joined room: ", room);
  });

  socket.on("eventChatMessage", async (msg, room) => {
    console.log("received eventChatMessage: ", msg);

    // Write the message to the database
    try {
      console.log("writing message to database");
      await insertMessageToDb(msg, room);

      console.log("broadcasting eventChatMessage to room: ", room);
      io.to(room).emit("eventChatMessage", msg);
    } catch (err) {
      console.error("Error writing message to database", err);
      return;
    }
  });
});

server.listen(5001, () => {
  console.log("listening on http://localhost:5001");
});
