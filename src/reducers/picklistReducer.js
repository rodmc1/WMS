import { FETCH_FACILITIES_AND_AMENITIES, FETCH_BUILDING_TYPES, FETCH_TRUCK_TYPES, FETCH_CLIENTS } from '../actions/types';

const initialState = {
  facilities_and_amenities: [],
  building_types: [],
  truck_types: [],
  clients: []
}

const picklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FACILITIES_AND_AMENITIES:
      return { ...state, facilities_and_amenities: action.payload };
    case FETCH_BUILDING_TYPES:
      return { ...state, building_types: action.payload };
    case FETCH_TRUCK_TYPES:
        return { ...state, truck_types: action.payload };
    case FETCH_CLIENTS:
      return { ...state, clients: action.payload };
    default:
      return state;
  }
}

export default picklistReducer;