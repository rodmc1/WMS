import { FETCH_FACILITIES_AND_AMENITIES, FETCH_BUILDING_TYPES } from '../actions/types';

const initialState = {
  facilities_and_amenities: []
}

const picklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FACILITIES_AND_AMENITIES:
      return { ...state, facilities_and_amenities: action.payload };
    case FETCH_BUILDING_TYPES:
      return { ...state, building_types: action.payload };
    default:
      return state;
  }
}

export default picklistReducer;