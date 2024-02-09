import {combineReducers} from 'redux';
import {CLEAN_STORE} from '../actionTypes/ProviderActionTypes';
import provider from './provider';
import customer from './customer';
import astrologer from './astrologer';

const rootReducer = combineReducers({
    provider,
    customer,
    astrologer,
});

const appReducer = (state, action) => {
  if (action.type == CLEAN_STORE) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducer;
