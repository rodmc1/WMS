import _ from 'lodash';
import inteluck from 'api/inteluck';
import { THROW_ERROR, FETCH_DASHBOARD, FETCH_DASHBOARD_DELIVERY_NOTICE, FETCH_DASHBOARD_PHYSICAL_ITEM } from './types';
import { dispatchError } from 'helper/error';

/**
 * For Dashboard Data
 */
 export const fetchDashboard = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Dashboard`, { params })
    .then(response => {
      dispatch({
        type: FETCH_DASHBOARD,
        payload: response.data[0]
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

/**
 * For Dashboard Delivery Notice
 */
 export const fetchDashboardDeliveryNotice = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Dashboard/Delivery-Notice`, { params })
    .then(response => {
      dispatch({
        type: FETCH_DASHBOARD_DELIVERY_NOTICE,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

/**
 * For Dashboard Delivery Notice
 */
 export const fetchDashboardPhysicalItem = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Dashboard/Physical-Item`, { params })
    .then(response => {
      dispatch({
        type: FETCH_DASHBOARD_PHYSICAL_ITEM,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}
