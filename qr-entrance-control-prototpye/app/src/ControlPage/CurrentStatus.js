import React from "react";
import QRReaderStatus from "./QRReaderStatus";

const CurrentStatus = ({qrReaderStatus, qrInfo}) => {
  const qrInfoText = (qrReaderStatus === QRReaderStatus.QR_READ_WAIT)? "Not yet READ" : JSON.stringify(qrInfo);

  return (
    <div>
      <div>
        <p> QR READER STATUS : {qrReaderStatus} </p>
      </div>
      <div>
        <p>QR Information : </p>
        <div>
          <p>{qrInfoText}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentStatus;