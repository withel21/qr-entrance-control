import io from 'socket.io-client';

let socket = null;

export const connectWithSocketIOServer = (serverInfo) => {
  socket = io(serverInfo);

  socket.on('connect', () => {
    console.log(`successfully connected with socket io server : socket.id = ${socket.id}`);
  });
};