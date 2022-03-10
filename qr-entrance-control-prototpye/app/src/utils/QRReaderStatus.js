const QRReaderStatus = {
  QR_READ_WAIT: "Read Wait",
  QR_READ_INFO: "Read Info",
  QR_READ_BLOCK: "Block Reader",
};

export default QRReaderStatus;

export const QRMessageMode = {
  ADMITTED: "ADMITTED",
  BLOCK: "BLOCK",
};

export const getMessageTemplateByStatus = (state, mode = "") => {
  switch(state) {
    case QRReaderStatus.QR_READ_WAIT:
      return "QR READ MODE\n\nShow your QR CODE!";
    case QRReaderStatus.QR_READ_INFO:
      return "USER VERIFYING...\n\nWait For Entrance Admission!";
    case QRReaderStatus.QR_READ_BLOCK:
      if(mode === "ADMITTED") {
        return "ENTRANCE ADMITTED!\n\nPlease Enter into Booth!";
      } else if(mode === "BLOCK") {
        return "QR READ BLOCKED\n\nNow booth is occupied... please wait";
      }
      return "UNKNOWN STATUS";
    default:
      return "UNKNOWN STATUS";
  }
}
