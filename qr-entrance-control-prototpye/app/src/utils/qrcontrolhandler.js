let QrControlHandlers = [];

export const registerQrControlHandler = (type, handler) => {
  const handler = { type, handler };
  QrControlHandlers.push(handler);
};

export const getQrControlHandler = (type) => {
  const handler = QrControlHandlers.find(item => item.type === type);

  return handler;
};

export const popQrControlHandler = (type) => {
  const handler = getQrControlHandler(type);
  QrControlHandlers = QrControlHandlers.filter(item => item.type !== type);
};