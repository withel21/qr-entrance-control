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
    resultHandler(`fail to connect to socket io : server : ${serverInfo} - errorMessage : ${err.message}`);
    socket.disconnect();
    socket = null;
  });
};

export const createChannel = (eventId, appId, resultHandler) => {
  const data = {
    eventId,
    appId,
  };
  socket.emit('create-channel', data);
};

export const controlQRReader = (eventId, appId, targetQrStatus, message) => {
  const data = {
    eventId,
    appId,
    targetQrStatus,
    message,
  };

  socket.emit('control-qr-reader', data);
};

export const destroyChannel = (eventId, appId) => {
  const data = {};

  socket.emit("destroy-channel", data);
};