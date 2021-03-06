import _ from 'lodash';
import inteluck from 'api/inteluck';
import { THROW_ERROR, FETCH_RECEIVING_RELEASING, FETCH_RECEIVING_ITEMS, SEARCH_RECEIVING_RELEASING, SEARCH_RECEIVING_RELEASING_ITEM } from './types';
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
 * For Delivery Notice Download CSV
 */
 export const fetchReceivingByCode = code => {
  return inteluck.get(`/v1/wms/Warehouse/Delivery_Notice`, { 
    params: { filter: code }
  });
}

/**
 * For Delivery Notice SKU by id CSV
 */
 export const searchReceivingAndReleasingSKU = params => {
  return inteluck.get(`/v1/wms/Warehouse/Delivery_Notice/Item`, { params });
}

/**
 * For Receiving Item list
 */
 export const fetchReceivingItem = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Delivery/Received_Item`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: FETCH_RECEIVING_ITEMS,
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
 * Create Receiving and Releasing Delivery
 */
export const createReceivingAndReleasing = params => {
  return inteluck.post(`/v1/wms/Warehouse/Delivery/Received`, params);
}

/**
 * Create Receiving and Releasing Delivery
 */
 export const createReceivingAndReleasingItem = params => {
  return inteluck.post(`/v1/wms/Warehouse/Delivery/Received_Item`, params);
}

/**
 * Edit Delivery Notice
 */
 export const updateDeliveryNoticeById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/Delivery_Notice/${id}`, params);
}

/**
 * For Search Receiving and Releasing
 * 
 * @param {object} params Query data
 */
 export const searchReceivingAndReleasing = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Delivery/Received`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_RECEIVING_RELEASING,
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
 * For Search Receiving and Releasing Items
 * 
 * @param {object} params Query data
 */
 export const searchReceivingAndReleasingItem = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Delivery/Received_Item`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_RECEIVING_RELEASING_ITEM,
        payload: {
          data: response.data,
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

// Warehouse files upload
export const uploadDocument = (id, received_id, type, files) => {
  const formData = new FormData();
  files.map(file => formData.append('Docs', file));
  let data = {
    received_id: received_id,
    received_document_type: type
  }
  if (id) {
    data = {
      id: id,
      received_id: received_id,
      received_document_type: type
    }
  }
  return inteluck.post(`v1/wms/Warehouse/Delivery-Received-Documents-File-Upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: data
  });
}

// Fetch Receiving uploaded files 
export const fetchDocument = id => {
  return inteluck.get(`v1/wms/Warehouse/Delivery-Received-Documents-Get?received_id=${id}`);
}

// Fetch All Receiving uploaded files 
export const fetchAllDocument = id => {
  return inteluck.get(`v1/wms/Warehouse/Delivery-Received-Documents-Get?delivery_notice_id=${id}`);
}

// Fetch All Receiving uploaded files 
export const downloadDocuments = id => {
  const config = { responseType: 'blob' };
  return inteluck.get(`v1/wms/Warehouse/Delivery-Received-Documents-Download?delivery_notice_id=${id}`, config);
}

/**
 * Delete Delivery Documents by id
 */
 export const deleteDeliveryDocumentsById = id => {
  return inteluck.delete(`/v1/wms/Warehouse/Delivery-Received-Documents-File/${id}`);
}