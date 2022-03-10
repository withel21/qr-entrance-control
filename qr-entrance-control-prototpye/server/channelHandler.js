const QRCntlCommand = require("../app/src/utils/qrcontrolcommand");

const channels = {};

const ioChannelHanlder = (io) => {
  io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on(QRCntlCommand.CREATE_CHANNEL, (data) => {
      console.log(`channel created from ${socket.id}`);
      console.log(data);
    });

    socket.on(QRCntlCommand.JOIN_CHANNEL, (data) => {
      console.log(`channel joined from ${socket.id}`);
      console.log(data);
    });

    socket.on(QRCntlCommand.CONTROL_QR_READER, (data) => {
      console.log(`control qr reader : ${socket.id}`);
      console.log(data);
    });

    socket.on(QRCntlCommand.QR_STATUS_UPDATE, (data) => {
      console.log(`qr status update from ${socket.id}`);
      console.log(data);
    });

    socket.on(QRCntlCommand.LEAVE_CHANNEL, (data) => {
      console.log(`channel left from ${socket.id}`);
      console.log(data);
    });

    socket.on(QRCntlCommand.DESTROY_CHANNEL, (data) => {
      console.log(`channel destroyed from ${socket.id}`);
      console.log(data);
    });
  });
};

module.exports = ioChannelHanlder;