import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import QRHandlerManager from "../utils/qrcontrolhandler";
import { setDefaultInboundingHandler } from "../utils/wss";
import ControlButtons from "./ControlButtons";
import ControlHistory from "./ControlHistory";
import CurrentStatus from "./CurrentStatus";
import QRReaderStatus from "./QRReaderStatus";

const ControlContent = (props) => {
  const [qrReaderStatus, setQrReaderStatus] = useState(QRReaderStatus.QR_READ_WAIT);
  const [qrInfoValue, setQrInfoValue] = useState("");
  const [historyValue, setHistoryValue] = useState([]);
  const { appId, eventId } = props;

  const controlButtonHanlder = (qrStatus) => {
    const now = new Date();
    const historyItem = `${now.toGMTString()} : move to "${qrStatus}"`;
    
    setHistoryValue([historyItem, ...historyValue]);
    
    // TODO: 

    setQrReaderStatus(qrStatus);
  };

  const defaultHandler = (command, data) => {
    const handler = QRHandlerManager.getDefaultHandlerByCommand(command);

    if(handler) {
      handler(eventId, appId, data);
    } else {
      console.log(`no handler for ${command} - inbounding data: ${data}`);
    }
  };

  useEffect(() => {
    setDefaultInboundingHandler(defaultHandler);
  });

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

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(ControlContent);
