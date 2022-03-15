const QRReaderStatus = {
  QR_READ_WAIT: "Read Wait",
  QR_READ_INFO: "Read Info",
  QR_READ_BLOCK: "On Shooting",
  QR_ENTRANCE_ADMIT: "Entrance Admitted",
};

export default QRReaderStatus;

export const getMessageTemplateByStatus = (state) => {
  switch(state) {
    case QRReaderStatus.QR_READ_WAIT:
      return "QR READ MODE\n\nShow your QR CODE!";
    case QRReaderStatus.QR_READ_INFO:
      return "USER VERIFYING...\n\nWait For Entrance Admission!";
    case QRReaderStatus.QR_ENTRANCE_ADMIT:
      return "ENTRANCE ADMITTED!\n\nPlease Enter into Booth!";
    case QRReaderStatus.QR_READ_BLOCK:
      return "QR READ BLOCKED\n\nNow booth is occupied... please wait";
    default:
      return "UNKNOWN STATUS";
  }
}
