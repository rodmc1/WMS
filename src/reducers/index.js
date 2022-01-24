import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import picklistReducer from './picklistReducer';
import warehousesReducer from './warehousesReducer';
import skuReducer from './skuReducer';
import noticeReducer from './noticeReducer';
import authReducer from './authReducer';
import logReducer from './logReducer';
import deliveryReducer from './deliveryReducer';
import dashboardReducer from './dashboardReducer';
import clientReducer from './clientReducer';

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  warehouses: warehousesReducer,
  picklist: picklistReducer,
  sku: skuReducer,
  notice: noticeReducer,
  logs: logReducer,
  receiving_releasing: deliveryReducer,
  dashboard: dashboardReducer,
  client: clientReducer
});