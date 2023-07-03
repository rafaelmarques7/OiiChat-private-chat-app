const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const mongojs = require("mongojs");
const messagesRouter = require("./messagesRouter");
const { writeMessageToDb } = require("./lib");

const db = mongojs("mongodb://localhost:27017/ChatApp", ["messages"]);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/messages", messagesRouter);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("eventChatMessage", (msg) => {
    console.log("received eventChatMessage: ", msg);

    // Write the message to the database
    db.messages.insert(msg, (err, doc) => {
      if (err) {
        console.error("Error writing message to database", err);
        return;
      }
      console.log("Message written to database: ", doc);
    });

    console.log("broadcasting eventChatMessage to everyone");
    io.emit("eventChatMessage", msg);
  });
});

server.listen(5001, () => {
  console.log("listening on http://localhost:5001");
});
