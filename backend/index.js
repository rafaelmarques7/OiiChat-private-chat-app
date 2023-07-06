const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const messagesRouter = require("./messagesRouter");
const { insertMessageToDb } = require("./lib");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://dq5rcunnxjcst.cloudfront.net",
    // || "http://localhost:3000",
  },
});

app.use(cors());
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

  socket.on("eventChatMessage", async (msg) => {
    console.log("received eventChatMessage: ", msg);

    // Write the message to the database
    try {
      console.log("writing message to database");
      await insertMessageToDb(msg);

      console.log("broadcasting eventChatMessage to everyone");
      io.emit("eventChatMessage", msg);
    } catch (err) {
      console.error("Error writing message to database", err);
      return;
    }
  });
});

server.listen(5001, () => {
  console.log("listening on http://localhost:5001");
});
