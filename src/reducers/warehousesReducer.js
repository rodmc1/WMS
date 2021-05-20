import { FETCH_WAREHOUSES, FETCH_WAREHOUSE, SEARCH_WAREHOUSE } from "actions/types";

const initialState = {
  count: 0,
  data: [],
  search: []
}

const warehouseReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_WAREHOUSES:
      return { ...action.payload };
    case FETCH_WAREHOUSE:
      return { ...state, data: { ...state.data, [action.payload.warehouse_client]: action.payload }};
    case SEARCH_WAREHOUSE:
      return { ...state, search: action.payload };
    default:
      return initialState;
  }
}

export default warehouseReducer;