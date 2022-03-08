const express = require("express");
const http = require("http");
const {v4 : uuid} = require("uuid");
const cors = require("cors");

const PORT = process.env.PORT || 5002;

const app = express();

const server = http.createServer(app);

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`user connected {socket.id}`);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
