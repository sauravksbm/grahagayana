import * as actionTypes from '../actionTypes/CustomerActionTypes';
const initialState = {
  astrologerList: null,
  passionData: null,
  locationData: null,
};
const astrologer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case actionTypes.SET_ASTROLOGER_LIST:
      return {
        ...state,
        astrologerList: payload,
      };

    case actionTypes.SET_RECOMMENDED_PASSION:
      return {
        ...state,
        passionData: payload,
      };
    case actionTypes.SET_RECOMMENDED_LOCATION:
      return {
        ...state,
        locationData: payload,
      };
    default:
      return state;
  }
};

export default astrologer;
