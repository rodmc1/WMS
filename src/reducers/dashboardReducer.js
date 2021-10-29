import { FETCH_DASHBOARD, FETCH_DASHBOARD_PHYSICAL_ITEM, FETCH_DASHBOARD_DELIVERY_NOTICE, SEARCH_WAREHOUSE_ITEM, FETCH_CBM_MONITORING, FETCH_PALLET_MONITORING } from "actions/types";

const initialState = {
  data: [],
  item: [],
  notice: [],
  search: [],
  pallet: [],
  cbm: []
}

const dashboardReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_DASHBOARD:
      return { ...state, data: action.payload };
    case FETCH_CBM_MONITORING:
      return { ...state, cbm: action.payload };
    case FETCH_PALLET_MONITORING:
      return { ...state, pallet: action.payload };
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