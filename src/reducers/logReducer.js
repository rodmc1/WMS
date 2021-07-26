import { FETCH_WAREHOUSE_LOGS, FILTER_LOGS } from "actions/types";

const initialState = {
  logs: [],
  search: []
}

const logReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_WAREHOUSE_LOGS:
      return { data: action.payload };
    case FILTER_LOGS:
      return { ...state, search: action.payload };
    default:
      return initialState;
  }
}

export default logReducer;