import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import Settinginputs from "./SettingInputs";
import SettingButtons from "./SettingButtons";
import { setAppID, setEventID, setServerInfo } from "../store/actions";

import { connectWithSocketIOServer } from "../utils/wss";

const SettingContent = (props) => {
  const { setSettings } = props;

  const [appIdValue, setAppIdValue] = useState("");
  const [eventIdValue, setEventIdValue] = useState("");
  const [serverInfoValue, setServerInfoValue] = useState("");
  let navigate = useNavigate();

  const handleNext = () => {
    setSettings(appIdValue, eventIdValue, serverInfoValue);

    connectWithSocketIOServer(serverInfoValue);

    // change below after connection!
    navigate("/control");
  };

  const handleReset = () => {
    setAppIdValue("");
    setEventIdValue("");
    setServerInfoValue("");
  };

  return (
    <>
      <Settinginputs 
        appIdValue={appIdValue}
        setAppIdValue={setAppIdValue}
        eventIdValue={eventIdValue}
        setEventIdValue={setEventIdValue}
        serverInfoValue={serverInfoValue}
        setServerInfoValue={setServerInfoValue}
      />
      <SettingButtons 
        handleNext={handleNext}
        handleReset={handleReset}
      />
    </>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setSettings: (appId, eventId, serverInfo) => { 
      dispatch(setAppID(appId)); 
      dispatch(setEventID(eventId));
      dispatch(setServerInfo(serverInfo));
    },
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(SettingContent);

