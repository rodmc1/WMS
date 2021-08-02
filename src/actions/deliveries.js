import _ from 'lodash';
import inteluck from 'api/inteluck';
import { THROW_ERROR, FETCH_RECEIVING_RELEASING } from './types';
import { dispatchError } from 'helper/error';

/**
 * Fetch All Reciving and Releasing by Delivery Notice Code
 */
export const fetchAllReceivingAndReleasingById = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Delivery/Received`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: FETCH_RECEIVING_RELEASING,
        payload: {
          data: _.mapKeys(response.data, 'recieved_id'),
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

/**
 * For Delivery Notice Download CSV
 */
 export const fetchAllReceivingAndReleasingByCode = id => {
  return inteluck.get(`/v1/wms/Warehouse/Delivery/Received`, { 
    params: { filter: id }
  });
}


/**
 * Edit Delivery Notice
 */
 export const updateDeliveryNoticeById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/Delivery_Notice/${id}`, params);
}