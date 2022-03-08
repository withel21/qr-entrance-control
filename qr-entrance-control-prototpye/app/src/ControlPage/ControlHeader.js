import React from "react";
import { connect } from "react-redux";

const ControlHeader = (props) => {
  const { appId, eventId, serverInfo } = props;
  return (
    <div>
      <div>
        <p> app id : {appId}</p>
      </div>
      <div>
        <p> event id : {eventId}</p>
      </div>
      <div>
        <p> server info : {serverInfo}</p>
      </div>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state
  };
};

export default connect(mapStoreStateToProps)(ControlHeader);