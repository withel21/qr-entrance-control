import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import QRHandlerManager from "../utils/qrcontrolhandler";
import { controlQRReader, createChannel, destroyChannel, sendError, setDefaultInboundingHandler } from "../utils/wss";
import ControlButtons from "./ControlButtons";
import ControlHistory from "./ControlHistory";
import CurrentStatus from "./CurrentStatus";
import QRReaderStatus, { getMessageTemplateByStatus } from "../utils/QRReaderStatus";
import QRCntlCommand from "../utils/qrcontrolcommand";

const ControlContent = (props) => {
  const [qrReaderStatus, setQrReaderStatus] = useState(QRReaderStatus.QR_READ_WAIT);
  const [qrInfoValue, setQrInfoValue] = useState("");
  const [historyValue, setHistoryValue] = useState([]);
  const [qrAppId, setQrAppId] = useState("");
  const { appId, eventId } = props;
  
  const createChannelResponseHandler = (eId, aId, data) => {
    console.log(`channel created!`);
  };
  const joinChannelResponseHandler = (eId, aId, data) => {
    console.log("join from " + data.appId);
    console.log(data);
    if(data.eventId === eId && data.eventAppId === aId) {
      setQrAppId(data.appId);
    }
    controlQRReader(eventId, appId, QRReaderStatus.QR_READ_WAIT, getMessageTemplateByStatus(QRReaderStatus.QR_READ_WAIT), controlQRReader);
  }
  const controlQRReaderResponseHandler = (eId, aId, data) => {
    console.log(`control QR reader message are sent! wait for QR reader status update!`);
  };  
  const qrStatusUpdateResponseHandler = (eId, aId, data) => {
    console.log("qr status from " + data.appId + " qrAppId = " + qrAppId + ", data.state = " + data.state + ", qrReaderStatus = " + qrReaderStatus);
    console.log(data);
    if(data.eventId === eId) {
      const preQrReaderStatus = qrReaderStatus;      

      if(data.state === QRReaderStatus.QR_READ_INFO && preQrReaderStatus !== QRReaderStatus.QR_READ_INFO) {
        setQrInfoValue(data.qrInfo);
        controlQRReader(eventId, appId, data.state, getMessageTemplateByStatus(data.state), controlQRReader);
      }
      setQrReaderStatus(data.state);
    }
  };

  const controlButtonHanlder = (qrStatus, error) => {
    const now = new Date();
    const historyItem = `${now.toGMTString()} : move to "${qrStatus}"`;
    
    if(error) {
      sendError(eventId, appId, error.command, error.message);
    }
    setHistoryValue([historyItem, ...historyValue]);
    const message = getMessageTemplateByStatus( qrStatus);
    controlQRReader(eventId, appId, qrStatus, message, controlQRReaderResponseHandler);
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
    QRHandlerManager.loadDefaultHandler();
    QRHandlerManager.setDefaultHandler(QRCntlCommand.CREATE_CHANNEL, createChannelResponseHandler);
    QRHandlerManager.setDefaultHandler(QRCntlCommand.CONTROL_QR_READER, controlQRReaderResponseHandler);
    QRHandlerManager.setDefaultHandler(QRCntlCommand.QR_STATUS_UPDATE, qrStatusUpdateResponseHandler);
    QRHandlerManager.setDefaultHandler(QRCntlCommand.JOIN_CHANNEL, joinChannelResponseHandler);

    createChannel(eventId, appId, createChannelResponseHandler);

    return () => {
      destroyChannel(eventId, appId);
    };
  }, []);

  return (
    <div>
      <CurrentStatus 
        qrAppId={qrAppId}
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
