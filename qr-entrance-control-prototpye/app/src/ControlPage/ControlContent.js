import React, { useState } from "react";
import ControlButtons from "./ControlButtons";
import ControlHistory from "./ControlHistory";
import CurrentStatus from "./CurrentStatus";
import QRReaderStatus from "./QRReaderStatus";

const ControlContent = () => {
  const [qrReaderStatus, setQrReaderStatus] = useState(QRReaderStatus.QR_READ_WAIT);
  const [qrInfoValue, setQrInfoValue] = useState("");
  const [historyValue, setHistoryValue] = useState([]);

  const controlButtonHanlder = (qrStatus) => {
    const now = new Date();
    const historyItem = `${now.toGMTString()} : move to "${qrStatus}"`;
    
    setHistoryValue([historyItem, ...historyValue]);
    
    // TODO: 

    setQrReaderStatus(qrStatus);
  };

  return (
    <div>
      <CurrentStatus 
        qrReaderStatus={qrReaderStatus}
        qrInfo={qrInfoValue}
      />
      <ControlButtons 
        qrStatus={qrReaderStatus}
        clickHandler={controlButtonHanlder}
      />
      <ControlHistory history={historyValue} />
    </div>
  );
};

export default ControlContent;
