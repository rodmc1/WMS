import { FETCH_WAREHOUSE_CLIENTS, FETCH_WAREHOUSE_CLIENT, FETCH_CLIENT_SKU } from "actions/types";

const initialState = {
  count: 0,
  data: [],
  sku: [],
  search: []
}

const clientReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_WAREHOUSE_CLIENTS:
      return { ...action.payload };
    case FETCH_WAREHOUSE_CLIENT:
      return { ...state, data: { ...state.data, [action.payload.client_name]: action.payload }};
    case FETCH_CLIENT_SKU:
      return { ...state, sku: action.payload };
    default:
      return initialState;
  }
}

export default clientReducer;