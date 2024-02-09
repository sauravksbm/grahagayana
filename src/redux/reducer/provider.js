import * as actionTypes from '../actionTypes/ProviderActionTypes';

const initialState = {
  id: null,
  providerData: null,
  dashboard: null,
  firebaseId: null,
  requestData: null,
};

const provider = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case actionTypes.SET_PROVIDER_DATA:
      return {
        ...state,
        providerData: payload,
      };
    case actionTypes.SET_DASHBOARD:
      return {
        ...state,
        dashboard: payload,
      };

    case actionTypes.SET_FIREBASE_ID:
      return {
        ...state,
        firebaseId: payload,
      };

    case actionTypes.SET_CHAT_REQUEST:
      return {
        ...state,
        requestData: payload,
      };
    default:
      return state;
  }
};

export default provider;
