// actions.js
export const ADD_COUNT = "ADD_COUNT";
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const SET_WEBREQUEST_LISTENER = "SET_WEBREQUEST_LISTENER";
export const ADD_WEBREQUEST_RESPONSE = "ADD_WEBREQUEST_RESPONSE";
export const GET_CURRENT_TAB = "GET_CURRENT_TAB";
export const SET_CURRENT_TAB = "SET_CURRENT_TAB";
export const SET_MANUAL_PORTABILITY = "SET_MANUAL_PORTABILITY";
export const GET_MANUAL_PORTABILITY = "GET_MANUAL_PORTABILITY";
export const DELETE_WEBREQUEST_RESPONSE = "DELETE_WEBREQUEST_RESPONSE"


export const addCount = (data) => {
  return {
    type: ADD_COUNT,
    data: data,
  };
}

export const addNotification = (data) => {
  return {
    type: ADD_NOTIFICATION,
    data: data,
  };
}

export const setWebRequestListener = (data) => {
  return {
    type: SET_WEBREQUEST_LISTENER,
    data: data,
  };
}
export const addWebRequestResponse = (data) => {
    return {
      type: ADD_WEBREQUEST_RESPONSE,
      data: data,
    };
  }

  export const getCurrentTab = (data) => {
    return {
      type: GET_CURRENT_TAB,
      data: data
    }
  }

  export const setCurrentTab = (data) => {
    return {
      type: SET_CURRENT_TAB,
      data: data
    }
  }

  export const setManualPortability = (data) => {
    return {
      type: SET_MANUAL_PORTABILITY,
      data: data
    }
  }

  export const getManualPortability = (data) => {
    return {
      type: GET_MANUAL_PORTABILITY,
      data: data
    }
  }

  export const deleteWebRequestResponse = (id) => {
    return {
      type: DELETE_WEBREQUEST_RESPONSE,
      data: id
    }
  }




