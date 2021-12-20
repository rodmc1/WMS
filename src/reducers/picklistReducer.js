import { FETCH_FACILITIES_AND_AMENITIES, FETCH_RECEIVED_DOCUMENT_TYPE, FETCH_BUILDING_TYPES, FETCH_TRUCK_TYPES, FETCH_CLIENTS, FETCH_UOM, FETCH_STORAGE_TYPE } from '../actions/types';

const initialState = {
  facilities_and_amenities: [],
  building_types: [],
  truck_types: [],
  uom: [],
  clients: [],
  storage_type: [],
  received_document_type: [],
}

const picklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FACILITIES_AND_AMENITIES:
      return { ...state, facilities_and_amenities: action.payload };
    case FETCH_BUILDING_TYPES:
      return { ...state, building_types: action.payload };
    case FETCH_TRUCK_TYPES:
        return { ...state, truck_types: action.payload };
    case FETCH_UOM:
      return { ...state, uom: action.payload };
    case FETCH_CLIENTS:
      return { ...state, clients: action.payload };
    case FETCH_STORAGE_TYPE:
      return { ...state, storage_type: action.payload };
    case FETCH_RECEIVED_DOCUMENT_TYPE:
      return { ...state, received_document_type: action.payload };
    default:
      return state;
  }
}

export default picklistReducer;