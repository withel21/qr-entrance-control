import io from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import QRCntlCommand from './qrcontrolcommand';
import QRHandlerManager from './qrcontrolhandler';

let socket = null;
let defaultHandler = null;

const notifyNoHandler = (command, token) => {
  const data = {
    token,
    command,
    message: 'no handler for this command',
  };

  socket.emit(QRCntlCommand.ERROR, data);
}

const processInboundingMessages = (command, data) => {
  const handler = QRHandlerManager.popQrControlHandler(data.token) || defaultHandler;

  if(handler) {
    handler(command, data);
  } else {
    console.log(`no handler for ${command} of ${data}`);
    notifyNoHandler(command, data.token);
  }
};

export const setDefaultInboundingHandler = (handler) => { defaultHandler = handler; }

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

  socket.on(QRCntlCommand.CREATE_CHANNEL, (data) => {
    processInboundingMessages(QRCntlCommand.CREATE_CHANNEL, data, defaultHandler);
  });

  socket.on(QRCntlCommand.JOIN_CHANNEL, (data) => {
    processInboundingMessages(QRCntlCommand.JOIN_CHANNEL, data, defaultHandler);
  });

  socket.on(QRCntlCommand.CONTROL_QR_READER, (data) => {
    processInboundingMessages(QRCntlCommand.CONTROL_QR_READER, data, defaultHandler);
  });

  socket.on(QRCntlCommand.QR_STATUS_UPDATE, (data) => {
    processInboundingMessages(QRCntlCommand.QR_STATUS_UPDATE, data, defaultHandler);
  });

  socket.on(QRCntlCommand.LEAVE_CHANNEL, (data) => {
    processInboundingMessages(QRCntlCommand.LEAVE_CHANNEL, data, defaultHandler);
  });

  socket.on(QRCntlCommand.DESTROY_CHANNEL, (data) => {
    processInboundingMessages(QRCntlCommand.DESTROY_CHANNEL, data, defaultHandler);
  });
};

export const createChannel = (eventId, appId, responseHandler) => {
  const token = uuid();
  const data = {
    token,
    eventId,
    appId,
  };

  QRHandlerManager.registerQrControlHandler(token, responseHandler);
  socket.emit(QRCntlCommand.CREATE_CHANNEL, data);
};

export const controlQRReader = (eventId, appId, targetQrStatus, message, responseHandler) => {
  const token = uuid();
  const data = {
    token,
    eventId,
    appId,
    targetQrStatus,
    message: {
      type: "text",     // for extenstion, e.g. url/text, url/img
      value: message,
    },
  };

  QRHandlerManager.registerQrControlHandler(token, responseHandler);
  socket.emit(QRHandlerManager.CONTROL_QR_READER, data);
};

export const destroyChannel = (eventId, appId) => {
  const token = uuid();
  const data = {
    token,
    eventId,
    appId,
  };

  socket.emit(QRHandlerManager.DESTROY_CHANNEL, data);
};

