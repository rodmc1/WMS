import inteluck from 'api/inteluck';
import { THROW_ERROR, FETCH_DASHBOARD, FETCH_DASHBOARD_DELIVERY_NOTICE, FETCH_DASHBOARD_PHYSICAL_ITEM, SEARCH_WAREHOUSE_ITEM, FETCH_CBM_MONITORING, FETCH_PALLET_MONITORING } from './types';
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
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: FETCH_DASHBOARD_PHYSICAL_ITEM,
        payload: {
          data: response.data,
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

/**
 * For Dashboard Table Search
 */
export const fetchDashboardPhysicalItemByName = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Dashboard/Physical-Item`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_WAREHOUSE_ITEM,
        payload: {
          data: response.data,
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

// For download CSV
export const fetchDashboardItems = (params) => {
  return inteluck.get(`/v1/wms/Warehouse/Dashboard/Physical-Item`, { params });
}


/**
 * For Monitoring Data
 */
 export const fetchPalletMonitoring = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Dashboard-Monitoring`, { 
    params: {
      from_date: params.from_date,
      to_date: params.to_date,
      uoh_type: 'Pallet'
    }})
    .then(response => {
      dispatch({
        type: FETCH_PALLET_MONITORING,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

/**
 * For Monitoring Data
 */
 export const fetchCBMMonitoring = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Dashboard-Monitoring`, { 
    params: {
      from_date: params.from_date,
      to_date: params.to_date,
      uoh_type: 'Cubic Meter'
    }})
    .then(response => {
      dispatch({
        type: FETCH_CBM_MONITORING,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}