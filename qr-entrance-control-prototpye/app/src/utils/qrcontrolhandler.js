import QRCntlCommand from "./qrcontrolcommand";

let QrControlHandlers = [];
const DefaultQrControlHandlers = {};

//! NOTICE!!!!!!
//! For commands CREATE_CHANNEL/CONTROL_QR_READER/QR_STATUS_UPDATE, there are NO DEFAULT HANDLER!!
//! So the handler for this command should be assigned on app level!

// handler = (eventId, appId, inboundData) => {}

// command : 'join-channel'
const defaultJoinChannelHandler = (eventId, appId, inboundData) => {
  console.log(`QR reader['${inboundData.appId}] is joined! - data : ${inboundData}`);  
};

// command : 'leave-channel'
const defaultLeaveChannelHandler = (eventId, appId, inboundData) => {
  console.log(`QR reader['${inboundData.appId}'] is left - data : ${inboundData}`);
};

// command : 'destroy-channel'
const defaultDestroyChannelHandler = (eventId, appId, inboundData) => {
  console.log(`App ends service!`);
};

// command : 'error'
const defaultErrorHandler = (eventId, appId, inboundData) => {
  console.log(`error occurs - data : ${inboundData}`);
};

const QRHandlerManager = {
  registerQrControlHandler: (token, handler) => {
    const h = { token, handler };
    QrControlHandlers.push(h);
  },
  getQrControlHandler: (token) => {
    const handler = QrControlHandlers.find(item => item.token === token);
  
    return handler;
  },
  popQrControlHandler: (token) => {
    const handler = QrControlHandlers.find(item => item.token === token);
    QrControlHandlers = QrControlHandlers.filter(item => item.token !== token);
  
    return handler;
  },

  setDefaultHandler: (command, handler = null) => { DefaultQrControlHandlers[command] = handler; },
  getDefaultHandlerByCommand: (command) => { return DefaultQrControlHandlers[command]; },
  loadDefaultHandler: () => {
    DefaultQrControlHandlers[QRCntlCommand.JOIN_CHANNEL] = defaultJoinChannelHandler;
    DefaultQrControlHandlers[QRCntlCommand.LEAVE_CHANNEL] = defaultLeaveChannelHandler;
    DefaultQrControlHandlers[QRCntlCommand.DESTROY_CHANNEL] = defaultDestroyChannelHandler;
    DefaultQrControlHandlers[QRCntlCommand.ERROR] = defaultErrorHandler;
  },
  reloadDefaultHandler: (command) => {
    switch(command) {
      case QRCntlCommand.JOIN_CHANNEL:
        DefaultQrControlHandlers[command] = defaultJoinChannelHandler;
        break;
      case QRCntlCommand.LEAVE_CHANNEL:
        DefaultQrControlHandlers[command] = defaultLeaveChannelHandler;
        break;
      case QRCntlCommand.DESTROY_CHANNEL:
        DefaultQrControlHandlers[command] = defaultDestroyChannelHandler;
        break;
      case QRCntlCommand.ERROR:
        DefaultQrControlHandlers[command] = defaultErrorHandler;
        break;
      default:
        defaultJoinChannelHandler[command] = null;
        break;
    }
  },
};

export default QRHandlerManager;