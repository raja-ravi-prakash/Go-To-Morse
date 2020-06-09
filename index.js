const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const axios = require("axios");
let cors = require("cors");
let body = require("body-parser");
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let handler = require("./core/DataHandler");

const db = new handler.Handler();
app.use(express.static("static"));
app.use(body.json());
app.use(cors());

io.on("connection", (socket) => {
  let backUP = db.read();

  if (!isNaN(backUP)) {
  } else {
    socket.emit("startup", backUP);
  }
  app.post("/msg", (req, res) => {
    let message = req.body;
    socket.emit("message", message);
    db.add(message);
    res.send("ok");
  });

  socket.on("new", (data) => {
    axios({
      method: "post",
      url: data.url,
      data: data,
    });

    db.add(data);
    socket.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected from user");
  });
});

server.listen(80);
