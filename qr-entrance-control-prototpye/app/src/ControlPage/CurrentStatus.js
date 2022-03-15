import React from "react";
import QRReaderStatus from "../utils/QRReaderStatus";

const CurrentStatus = ({qrAppId, qrReaderStatus, qrInfo}) => {
  const qrInfoText = (qrReaderStatus === QRReaderStatus.QR_READ_WAIT)? "Not yet READ" : JSON.stringify(qrInfo);

  return (
    <div>
      <div>
        <p> QR App Id : {qrAppId} </p>
      </div>
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