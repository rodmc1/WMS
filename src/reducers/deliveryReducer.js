import { SEARCH_RECEIVING_RELEASING, FETCH_RECEIVING_RELEASING } from "actions/types";

const initialState = {
  count: 0,
  data: [],
  search: []
}

const deliveryReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_RECEIVING_RELEASING:
      return { ...action.payload };
    case SEARCH_RECEIVING_RELEASING:
      return { ...state, search: action.payload };
    default:
      return initialState;
  }
}

export default deliveryReducer;