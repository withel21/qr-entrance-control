import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import QRHandlerManager from "../utils/qrcontrolhandler";
import { controlQRReader, createChannel, setDefaultInboundingHandler } from "../utils/wss";
import ControlButtons from "./ControlButtons";
import ControlHistory from "./ControlHistory";
import CurrentStatus from "./CurrentStatus";
import QRReaderStatus, { getMessageTemplateByStatus, QRMessageMode } from "../utils/QRReaderStatus";
import QRCntlCommand from "../utils/qrcontrolcommand";

const ControlContent = (props) => {
  const [qrReaderStatus, setQrReaderStatus] = useState(QRReaderStatus.QR_READ_WAIT);
  const [qrInfoValue, setQrInfoValue] = useState("");
  const [historyValue, setHistoryValue] = useState([]);
  const { appId, eventId } = props;

  const createChannelResponseHandler = (eId, aId, data) => {
    console.log(`channel created!`);
  };
  const controlQRReaderResponseHandler = (eId, aId, data) => {
    console.log(`control QR reader message are sent! wait for QR reader status update!`);
  };
  const qrStatusUpdateResponseHandler = (eId, aId, data) => {
    if(data.eventId === eId && data.aId === appId) {
      setQrReaderStatus(data.state);

      if(data.state === QRReaderStatus.QR_READ_INFO) {
        setQrInfoValue(data.qrInfo);
      }
    }
  };

  const controlButtonHanlder = (qrStatus) => {
    const now = new Date();
    const historyItem = `${now.toGMTString()} : move to "${qrStatus}"`;
    
    setHistoryValue([historyItem, ...historyValue]);
    // ADMITTED -> BLOCK can be??
    const message = getMessageTemplateByStatus( qrStatus, (qrStatus === QRReaderStatus.QR_READ_BLOCK)? QRMessageMode.ADMITTED : "" );
    controlQRReader(eventId, appId, qrStatus, message, controlQRReaderResponseHandler);
    //setQrReaderStatus(qrStatus);
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
    QRHandlerManager.setDefaultHandler(QRCntlCommand.CREATE_CHANNEL, createChannelResponseHandler);
    QRHandlerManager.setDefaultHandler(QRCntlCommand.CONTROL_QR_READER, controlQRReaderResponseHandler);
    QRHandlerManager.setDefaultHandler(QRCntlCommand.QR_STATUS_UPDATE, qrStatusUpdateResponseHandler);

    createChannel(eventId, appId, createChannelResponseHandler);
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
