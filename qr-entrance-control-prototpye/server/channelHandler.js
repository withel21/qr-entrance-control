const {v4 : uuid} = require("uuid");

const QRCntlCommand = {
  CREATE_CHANNEL : 'create-channel',
  JOIN_CHANNEL: 'join-channel',
  CONTROL_QR_READER: 'control-qr-reader',
  QR_STATUS_UPDATE: 'qr-status-update',
  LEAVE_CHANNEL : 'leave-channel',
  DESTROY_CHANNEL : 'destroy-channel',
  ERROR : 'error',
};

let connectedApps = [];
let channels = [];

// socket.io handlers
const createChannelHandler = (data, socket) => {
  console.log(`channel created from ${socket.id}`);
  console.log(data);
  const { token, eventId, appId } = data;
  const chId = uuid();

  // if needed, check whether eventId is valid or not!!!

  const eventApp = {
    type: "EventApp",
    eventId,
    appId,
    targetAppId: "",
    socketId: socket.id,
    channelId: chId,
  };

  connectedApps = [...connectedApps, eventApp];

  const newChannel = {
    id: chId,
    connectedApps: [eventApp],
  };

  // join socket.io room
  socket.join(chId);

  channels = [...channels, newChannel];

  socket.emit(QRCntlCommand.CREATE_CHANNEL, { token, eventId, appId, channelId: chId});
};

const joinChannelHandler = (data, socket) => {
  console.log(`channel joined from ${socket.id}`);
  console.log(data);
  const { token, eventId, appId, eventAppId, qrStatus } = data;

  const eventApp = connectedApps.find((app) => (app.type === "EventApp" && app.eventId === eventId && app.appId === eventAppId));
  if (eventApp) {
    const channel = channels.find((ch) => (ch.id === eventApp.channelId));

    const qrApp = {
      type: "QRApp",
      eventId,
      appId,
      targetAppId: eventApp.appId,
      socketId: socket.id,
      channelId: channel.id,
    };

    eventApp.targetAppId = appId;

    connectedApps = [...connectedApps, qrApp];

    channel.connectedApps = [...channel.connectedApps, qrApp];

    const joinResponseMessage = {
      token, eventId, appId, chennelId: channel.id,
    };

    io.to(eventApp.socketId).emit(QRCntlCommand.JOIN_CHANNEL, joinResponseMessage);
    socket.emit(QRCntlCommand.JOIN_CHANNEL, joinResponseMessage);
  } else {
    socket.emit(QRCntlCommand.ERROR, {
      token,
      command: QRCntlCommand.JOIN_CHANNEL,
      message: `no event app connected for appId: ${targetAppId}, eventId: ${eventId}`,
    });
  }
}

const controlQrReaderHandler = (data, socket) => {
  console.log(`control qr reader : ${socket.id}`);
  console.log(data);

  const { token, eventId, appId, targetQrStatus } = data;
  const qrApp = connectedApps.find((app) => (app.eventId === eventId && app.targetAppId === appId && app.type === "QRApp"));
  if(qrApp) {
    io.to(qrApp.socketId).emit(QRCntlCommand.CONTROL_QR_READER, data);
    socket.emit(QRCntlCommand, {token, eventId, appId, targetQrStatus});
  } else {
    socket.emit(QRReaderStatus.ERROR, {
      token,
      command: QRCntlCommand.CONTROL_QR_READER,
      message: `no qr app connected for appId: ${appId}, eventId: ${eventId}`,
    });
  }
};

const qrStateUpdateHandler = (data, socket) => {
  console.log(`qr status update from ${socket.id}`);
  console.log(data);
  const { token, eventId, appId } = data;
  const eventApp = connectedApps.find((app) => (app.eventId === eventId && app.targetAppId === appId && app.type === "EventApp"));
  if(eventApp) {
    io.to(eventApp.socketId).emit(QRCntlCommand.QR_STATUS_UPDATE, data);
    socket.emit(QRCntlCommand, {token, eventId, appId});
  } else {
    socket.emit(QRReaderStatus.ERROR, {
      token,
      command: QRCntlCommand.QR_STATUS_UPDATE,
      message: `no event app connected for appId: ${appId}, eventId: ${eventId}`,
    });
  }
};

const leaveChannelHandler = (data, socket) => {
  console.log(`channel left from ${socket.id}`);
  console.log(data);
  const { token, eventId, appId } = data;
  const qrApp = connectedApps.find((app) => (app.eventId === eventId && app.appId === appId && app.type === "QRApp"));
  const eventApp = connectedApps.find((app) => (app.eventId === eventId && app.targetAppId === appId && app.type === "EventApp"));
  if(qrApp) {
    if(eventApp) {
      eventApp.targetAppId = "";
      io.to(eventApp.socketId).emit(QRCntlCommand.LEAVE_CHANNEL, data);
    }
    
    connectedApps = connectedApps.filter((app) => (app.eventId !== eventId || app.appId !== appId))
    socket.emit(QRCntlCommand.LEAVE_CHANNEL, data);

    const channel = channels.find((ch) => (ch.id === qrApp.channelId));
    if(channel) { 
      channel.connectedApps = channel.connectedApps.filter((app) => (app.socketId !== socket.id)); 
      socket.leave(channel.id);

      if(channel.connectedApps.length === 0) {
        channels = channels.filter((ch) => ch.id !== channel.id);
      }
    }
  } else {
    socket.emit(QRReaderStatus.ERROR, {
      token,
      command: QRCntlCommand.LEAVE_CHANNEL,
      message: `not registered you(QRApp) appId: ${appId}, eventId: ${eventId}`,
    });
  }
};

const destroyChannelHandler = (data, socket) => {
  console.log(`channel destroyed from ${socket.id}`);
  console.log(data);
  const {token, eventId, appId} = data;

  const eventApp = connectedApps.find((app) => (app.eventId === eventId && app.appId === appId && app.type === "EventApp"));
  const channel = channels.find((ch) => (ch.id === eventApp.channelId));
  if(eventApp) {
    if(eventApp.targetAppId !== "") {
      const qrApp = connectedApps.find((app) => (app.eventId === eventId && app.targetAppId === appId && app.type === "QRApp"));
      qrApp.targetAppId = "";
      io.to(qrApp.socketId).emit(QRCntlCommand.DESTROY_CHANNEL, data);
      if(channel) { io.to(qrApp.socketId).leave(channel.id); }
      connectedApps = connectedApps.filter((app) => (app.appId !== qrApp.appId || app.eventId !== qrApp.eventId));
    }

    if(channel) {
      socket.emit(QRCntlCommand.DESTROY_CHANNEL, data);
      socket.leave(channel.id);

      connectedApps = connectedApps.filter((app) => (app.appId !== appId || app.eventId !== eventId));
      channels = channels.filter((ch) => (ch.id !== channel.id));
    } else {
      socket.emit(QRReaderStatus.ERROR, {
        token,
        command: QRCntlCommand.DESTROY_CHANNEL,
        message: `not registered you(EventApp) to any channel! - appId: ${appId}, eventId: ${eventId}`,
      });
    }
  } else {
    socket.emit(QRReaderStatus.ERROR, {
      token,
      command: QRCntlCommand.DESTROY_CHANNEL,
      message: `not registered you(EventApp) - appId: ${appId}, eventId: ${eventId}`,
    });
  }
};

const ioChannelHanlder = (io) => {
  io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on(QRCntlCommand.CREATE_CHANNEL, (data) => {
      createChannelHandler(data, socket);
    });

    socket.on(QRCntlCommand.JOIN_CHANNEL, (data) => {
      joinChannelHandler(data, socket);
    });

    socket.on(QRCntlCommand.CONTROL_QR_READER, (data) => {
      controlQrReaderHandler(data, socket);
    });

    socket.on(QRCntlCommand.QR_STATUS_UPDATE, (data) => {
      qrStateUpdateHandler(data, socket);
    });

    socket.on(QRCntlCommand.LEAVE_CHANNEL, (data) => {
      leaveChannelHandler(data, socket);
    });

    socket.on(QRCntlCommand.DESTROY_CHANNEL, (data) => {
      destroyChannelHandler(data, socket);
    });
  });
};

module.exports = ioChannelHanlder;