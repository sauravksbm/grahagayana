import * as actionTypes from '../actionTypes/CustomerActionTypes';

export const setAstrologerList = payload =>({
    type: actionTypes.SET_ASTROLOGER_LIST,
    payload,
  })

  export const setRecommendedPassionList = payload =>({
    type: actionTypes.SET_RECOMMENDED_PASSION,
    payload,
  })

  export const setRecommendedLocationList = payload =>({
    type: actionTypes.SET_RECOMMENDED_LOCATION,
    payload,
  })
