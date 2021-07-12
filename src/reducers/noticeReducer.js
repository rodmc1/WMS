import { FETCH_DELIVERY_NOTICES, FETCH_DELIVERY_NOTICE, SEARCH_DELIVERY_NOTICE, FETCH_DELIVERY_NOTICE_SKU, SEARCH_DELIVERY_NOTICE_SKU } from "actions/types";

const initialState = {
  count: 0,
  data: [],
  sku: [],
  searchedSKU: [],
  search: []
}

const noticeReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_DELIVERY_NOTICES:
      return { ...action.payload };
    case FETCH_DELIVERY_NOTICE:
      return { ...state, data: { ...state.data, [action.payload.unique_code]: action.payload }};
    case FETCH_DELIVERY_NOTICE_SKU:
      return { ...state, sku: action.payload };
    case SEARCH_DELIVERY_NOTICE:
      return { ...state, search: action.payload };
    case SEARCH_DELIVERY_NOTICE_SKU:
      return { ...state, searchedSKU: action.payload };
    default:
      return initialState;
  }
}

export default noticeReducer;