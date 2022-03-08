const ioChannelHanlder = (io) => {
  io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on('create-channel', (data) => {
      console.log(`channel created from ${socket.id}`);
      console.log(data);
    });

    socket.on('join-channel', (data) => {
      console.log(`channel joined from ${socket.id}`);
      console.log(data);
    });

    socket.on('control-qr-reader', (data) => {
      console.log(`control qr reader : ${socket.id}`);
      console.log(data);
    });

    socket.on('qr-status-update', (data) => {
      console.log(`qr status update from ${socket.id}`);
      console.log(data);
    });

    socket.on('leave-channel', (data) => {
      console.log(`channel left from ${socket.id}`);
      console.log(data);
    });

    socket.on('destroy-channel', (data) => {
      console.log(`channel destroyed from ${socket.id}`);
      console.log(data);
    });
  });
};

module.exports = ioChannelHanlder;