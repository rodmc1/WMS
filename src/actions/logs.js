import _ from 'lodash';
import inteluck from 'api/inteluck';
import { FETCH_WAREHOUSE_LOGS, FILTER_LOGS, THROW_ERROR } from './types';
import { dispatchError } from 'helper/error';


/**
 * Fetch Warehouse Logs
 */
export const fetchAllDeliveryNotice = (target_id) => {
  return inteluck.get(`/v1/wms/Warehouse/${target_id}/Logs`);
}

/**
 * Fetch Audit Logs
 * 
 * @param {object} params Set of data
 */
 export const fetchAuditLogs = params => dispatch => {
  inteluck.get('/v1/wms/Warehouse/Logs', { params })
    .then(response => {
      dispatch({
        type: FETCH_WAREHOUSE_LOGS,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
};

/**
 * Fetch Audit Logs
 * 
 * @param {object} params Set of data
 */
 export const fetchfilteredAuditLog = params => dispatch => {
  inteluck.get('/v1/wms/Warehouse/Logs', { params })
    .then(response => {
      dispatch({
        type: FILTER_LOGS,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
};

