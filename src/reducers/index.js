import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import picklistReducer from './picklistReducer';
import warehousesReducer from './warehousesReducer';
import skuReducer from './skuReducer';

export default combineReducers({
  error: errorReducer,
  warehouses: warehousesReducer,
  picklist: picklistReducer,
  sku: skuReducer
});