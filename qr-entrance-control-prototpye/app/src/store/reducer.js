import Actions from "./actions";

const initState = {
  appId: '',
  eventId: '',
  serverInfo: ''
};

const reducer = (state = initState, action) => {
  switch(action.type) {
    case Actions.SET_APP_ID:
      return {
        ...state,
        appId: action.appId,
      };
    case Actions.SET_EVENT_ID:
      return {
        ...state,
        eventId: action.eventId,
      }
    case Actions.SET_SERVER_INFO:
      return {
        ...state,
        serverInfo: action.serverInfo,
      }
    default:
      return state;
  }
}; 

export default reducer;
