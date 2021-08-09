import { SEARCH_RECEIVING_RELEASING, FETCH_RECEIVING_RELEASING, FETCH_RECEIVING_ITEMS, SEARCH_RECEIVING_RELEASING_ITEM } from "actions/types";

const initialState = {
  count: 0,
  data: [],
  search: [],
  searchItem: [],
  receivingItem: []
}

const deliveryReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_RECEIVING_RELEASING:
      return { ...action.payload };
    case SEARCH_RECEIVING_RELEASING:
      return { ...state, search: action.payload };
    case SEARCH_RECEIVING_RELEASING_ITEM:
      return { ...state, searchItem: action.payload };
    case FETCH_RECEIVING_ITEMS:
      return { ...state, receivingItem: action.payload };
    default:
      return initialState;
  }
}

export default deliveryReducer;