import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import picklistReducer from './picklistReducer';
import warehousesReducer from './warehousesReducer';

export default combineReducers({
  error: errorReducer,
  warehouses: warehousesReducer,
  picklist: picklistReducer
});