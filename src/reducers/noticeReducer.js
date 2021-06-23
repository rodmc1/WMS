import { FETCH_DELIVERY_NOTICES, FETCH_DELIVERY_NOTICE, SEARCH_DELIVERY_NOTICE } from "actions/types";

const initialState = {
  count: 0,
  data: [],
  search: []
}

const noticeReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_DELIVERY_NOTICES:
      return { ...action.payload };
    case FETCH_DELIVERY_NOTICE:
      return { ...state, data: action.payload };
    case SEARCH_DELIVERY_NOTICE:
      return { ...state, search: action.payload };
    default:
      return initialState;
  }
}

export default noticeReducer;