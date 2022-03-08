import io from 'socket.io-client';

let socket = null;

export const connectWithSocketIOServer = (serverInfo, resultHandler) => {
  socket = io(serverInfo);

  socket.on('connect', () => {
    console.log(`successfully connected with socket io server : socket.id = ${socket.id}`);
    resultHandler("");
  });

  socket.on("connect_error", (err) => {
    console.log(`fail to connect to socket io server : ${serverInfo}`);
    resultHandler(err.message);
    socket.disconnect();
    socket = null;
  });
};