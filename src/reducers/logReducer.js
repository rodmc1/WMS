import { FETCH_WAREHOUSE_LOGS } from "actions/types";

const initialState = {
  logs: []
}

const logReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_WAREHOUSE_LOGS:
      return { data: action.payload };
    default:
      return initialState;
  }
}

export default logReducer;