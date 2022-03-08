import React from "react";
import QRReaderStatus from "./QRReaderStatus";

const Button = ({buttonText, clickHandler}) => {
  return (
    <button onClick={clickHandler}>
      {buttonText}
    </button>
  );
};

const ControlButtons = ({qrStatus, clickHandler}) => {
  const isQrReadInfo = (qrStatus === QRReaderStatus.QR_READ_INFO);
  const isQrReadWait = (qrStatus === QRReaderStatus.QR_READ_WAIT);
  const buttonText = (qrStatus === QRReaderStatus.QR_READ_INFO) ? "Admit Entrance" : "Open QR Reader";
  
  const handlerForQRReadWait = () => {
    clickHandler(QRReaderStatus.QR_READ_WAIT);
  };

  const handlerForQRReadInfo = () => {
    clickHandler(QRReaderStatus.QR_READ_INFO);
  };

  const handlerForQRReadBlock = () => {
    clickHandler(QRReaderStatus.QR_READ_BLOCK);
  };

  const targetHandler = (qrStatus === QRReaderStatus.QR_READ_INFO) ? handlerForQRReadBlock : handlerForQRReadWait;

  return (
    <div>
      { qrStatus !== QRReaderStatus.QR_READ_WAIT && (
        <Button
          buttonText={buttonText}
          clickHandler={targetHandler}
        />
      )}
      { qrStatus === QRReaderStatus.QR_READ_INFO && (
        <Button 
          buttonText="Ignore"
          clickHandler={handlerForQRReadWait}
        />
      )}
      { qrStatus === QRReaderStatus.QR_READ_WAIT && (
        <Button
          buttonText="Debug(Go to read info)"
          clickHandler={handlerForQRReadInfo}
        />
      )}
    </div>
  );
};

export default ControlButtons;

