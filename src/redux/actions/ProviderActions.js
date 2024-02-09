import * as actionTypes from '../actionTypes/ProviderActionTypes';

export const setProviderData = payload => ({
  type: actionTypes.SET_PROVIDER_DATA,
  payload,
});

export const setDashboard = payload => ({
  type: actionTypes.SET_DASHBOARD,
  payload,
});

export const setFirebaseId = payload => ({
  type: actionTypes.SET_FIREBASE_ID,
  payload,
});

export const setChatRequest = payload => ({
  type: actionTypes.SET_CHAT_REQUEST,
  payload,
});


export const setCleanStore = () => ({
  type: actionTypes.CLEAN_STORE,
});