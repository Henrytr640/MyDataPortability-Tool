import {
  SET_WEBREQUEST_LISTENER,
  ADD_COUNT,
  ADD_WEBREQUEST_RESPONSE,
  GET_CURRENT_TAB,
  SET_CURRENT_TAB,
  SET_MANUAL_PORTABILITY,
  DELETE_WEBREQUEST_RESPONSE,
} from "./actions.js";
import { IsJsonString } from "./utils.js";
const initialState = {
  counter: 0,
  webRequestListener: false,
  webRequestFiles: [],
  manualPortability: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_COUNT:
      return { ...state, counter: (state.counter += action.data) };
    case SET_WEBREQUEST_LISTENER:
      return { ...state, webRequestListener: action.data };
    case ADD_WEBREQUEST_RESPONSE:
      if (IsJsonString(action.data.requestData)) {
        return {
          ...state,
          webRequestFiles: [...state.webRequestFiles, action.data],
        };
      }
    case GET_CURRENT_TAB:
      return state;
    case SET_CURRENT_TAB:
      return { ...state, currentTab: action.data };
    case SET_MANUAL_PORTABILITY:
      return {
        ...state,
        manualPortability: [...state.manualPortability, action.data],
      };
    case DELETE_WEBREQUEST_RESPONSE:
      return {
        ...state,
        webRequestFiles: state.webRequestFiles.filter(
          (item) => item.id !== action.data
        ),
      };
    default:
      return state;
  }
}

export default rootReducer;
