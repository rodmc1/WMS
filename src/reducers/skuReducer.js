import { FETCH_WAREHOUSE_SKUS, FETCH_WAREHOUSE_SKU, SEARCH_SKU } from "actions/types";

const initialState = {
  count: 0,
  data: [],
  search: []
}

const skuReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_WAREHOUSE_SKUS:
      return { ...action.payload };
    case FETCH_WAREHOUSE_SKU:
      return { ...state, data: { ...state.data, [action.payload.item_id]: action.payload }};
    case SEARCH_SKU:
      return { ...state, search: action.payload };
    default:
      return initialState;
  }
}

export default skuReducer;