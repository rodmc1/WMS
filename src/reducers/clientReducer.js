import { FETCH_WAREHOUSE_CLIENTS, FETCH_WAREHOUSE_CLIENT, FETCH_CLIENT_SKU, SEARCH_CLIENT, SEARCH_CLIENT_SKU, FETCH_CLIENT_LOGS, SEARCH_CLIENT_LOGS } from "actions/types";

const initialState = {
  count: 0,
  data: [],
  sku: [],
  search: [],
  sku_search: [],
  logs: [],
  search_audit_log: []
}

const clientReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_WAREHOUSE_CLIENTS:
      return { ...action.payload };
    case FETCH_WAREHOUSE_CLIENT:
      return { ...state, data: { ...state.data, [action.payload.client_name]: action.payload }};
    case FETCH_CLIENT_SKU:
      return { ...state, sku: action.payload };
    case SEARCH_CLIENT:
      return { ...state, search: action.payload };
    case SEARCH_CLIENT_SKU:
      return { ...state, sku_search: action.payload };
    case FETCH_CLIENT_LOGS:
      return { ...state, logs: action.payload };
    case SEARCH_CLIENT_LOGS:
      return { ...state, search_audit_log: action.payload };
    default:
      return initialState;
  }
}

export default clientReducer;