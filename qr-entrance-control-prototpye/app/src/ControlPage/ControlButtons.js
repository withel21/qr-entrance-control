import React from "react";
import QRReaderStatus from "../utils/QRReaderStatus";

const Button = ({buttonText, clickHandler}) => {
  return (
    <button onClick={clickHandler}>
      {buttonText}
    </button>
  );
};

const ControlButtons = ({qrStatus, clickHandler}) => {
  const handlerForQRReadWait = () => {
    clickHandler(QRReaderStatus.QR_READ_WAIT);
  };

  const handlerForQREntranceAdmit = () => {
    clickHandler(QRReaderStatus.QR_ENTRANCE_ADMIT);
  };

  const handlerForQRReadBlock = () => {
    clickHandler(QRReaderStatus.QR_READ_BLOCK);
  };

  const handlerForDrop = () => {
    clickHandler(QRReaderStatus.QR_READ_WAIT, { command: QRReaderStatus.QR_READ_WAIT, message: "Admission Denied! Please check your QR code." })
  };

  const targetHandler = () => {
    switch(qrStatus) {
      case QRReaderStatus.QR_READ_INFO: return handlerForQREntranceAdmit;
      case QRReaderStatus.QR_ENTRANCE_ADMIT: return handlerForQRReadBlock;
      case QRReaderStatus.QR_READ_BLOCK: return handlerForQRReadWait;
      default: return null;
    }
  };
  const getButtonText = () => {
    switch(qrStatus) {
      case QRReaderStatus.QR_READ_INFO: return "Admit Entrance";
      case QRReaderStatus.QR_ENTRANCE_ADMIT: return "On Shooting";
      case QRReaderStatus.QR_READ_BLOCK: return "Next Fan Wait";
      default: return "";
    }
  };

  return (
    <div>
      { qrStatus !== QRReaderStatus.QR_READ_WAIT && (
        <Button
          buttonText={getButtonText()}
          clickHandler={targetHandler()}
        />
      )}
      { qrStatus !== QRReaderStatus.QR_READ_WAIT && (
        <Button 
          buttonText="Drop"
          clickHandler={(qrStatus == QRReaderStatus.QR_READ_INFO) ? handlerForDrop : handlerForQRReadWait}
        />
      )}
    </div>
  );
};

export default ControlButtons;

