const Actions = {
  SET_APP_ID: "SET_APP_ID",
  SET_EVENT_ID: "SET_EVENT_ID",
  SET_SERVER_INFO: "SET_SERVER_INFO"
};

export const setAppID = (appId) => {
  return {
    type: Actions.SET_APP_ID,
    appId
  };
};

export const setEventID = (eventId) => {
  return {
    type: Actions.SET_EVENT_ID,
    eventId
  };
};

export const setServerInfo = (serverInfo) => {
  return {
    type: Actions.SET_SERVER_INFO,
    serverInfo
  };
};


export default Actions;