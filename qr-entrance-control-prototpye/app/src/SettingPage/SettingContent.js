import React, { useState } from "react";
import { connect } from "react-redux";
//import { useNavigate } from "react-router-dom";

import Settinginputs from "./SettingInputs";
import SettingButtons from "./SettingButtons";

const SettingContent = (props) => {
  const [appIdValue, setAppIdValue] = useState("");
  const [eventIdValue, setEventIdValue] = useState("");
  const [serverInfoValue, setServerInfoValue] = useState("");

  const handleNext = () => {
    // TODO: 
    
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

export default connect(mapStoreStateToProps)(SettingContent);

