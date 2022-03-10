const express = require("express");
const http = require("http");
const cors = require("cors");
const channelHandler = require("./channelHandler");

const PORT = process.env.PORT || 5002;

const app = express();

const server = http.createServer(app);

app.use(cors());

channelHandler(require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
}));

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
