import { THROW_ERROR } from '../actions/types';

const errorReducer = (state = {}, action) => {
  switch (action.type) {
    case THROW_ERROR:
      return action.payload;
    default:
      return state;
  }
}

export default errorReducer;