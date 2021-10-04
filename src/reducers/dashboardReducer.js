import { FETCH_DASHBOARD, FETCH_DASHBOARD_PHYSICAL_ITEM, FETCH_DASHBOARD_DELIVERY_NOTICE, SEARCH_WAREHOUSE_ITEM } from "actions/types";

const initialState = {
  data: [],
  item: [],
  notice: [],
  search: [],
}

const dashboardReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_DASHBOARD:
      return { ...state, data: action.payload };
    case FETCH_DASHBOARD_PHYSICAL_ITEM:
      return { ...state, item: action.payload };
    case FETCH_DASHBOARD_DELIVERY_NOTICE:
      return { ...state, notice: action.payload };
    case SEARCH_WAREHOUSE_ITEM:
      return { ...state, search: action.payload };
    default:
      return initialState;
  }
}

export default dashboardReducer;