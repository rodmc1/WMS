import { FETCH_ACCOUNT_DETAILS } from '../actions/types';

const initialState = {
  data: [],
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT_DETAILS:
      return { ...state, data: action.payload };
    default:
      return state;
  }
}

export default authReducer;