import _ from 'lodash';
import inteluck from 'api/inteluck';
import { FETCH_DELIVERY_NOTICES, THROW_ERROR, SEARCH_DELIVERY_NOTICE, FETCH_DELIVERY_NOTICE } from './types';
import { dispatchError } from 'helper/error';


/**
 * For Delivery Notice Download CSV
 */
export const fetchAllDeliveryNotice = () => {
  return inteluck.get(`/v1/wms/Warehouse/Delivery_Notice`);
}

/**
 * Fetch single delivery notice
 */
export const fetchDeliveryNoticeById = id => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Delivery_Notice`, { 
    params: {
      filter: id
    }})
    .then(response => {
      dispatch({
        type: FETCH_DELIVERY_NOTICE,
        payload: response.data[0]
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

/**
 * Create Delivery Notice
 */
export const createDeliveryNotice = params => {
  return inteluck.post(`/v1/wms/Warehouse/Delivery_Notice`, params);
}


/**
 * Edit Delivery Notice
 */
export const updateDeliveryNoticeById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/Delivery_Notice/${id}`, params);
}


/**
 * Delete Delivery Notice Documents
 */
export const deleteDeliveryNoticeFilesById = id => {
  return inteluck.delete(`/v1/wms/Warehouse/Delivery_Notice-File-Upload/${id}`);
}


/**
 * For Delete Delivery Notice
 * 
 * @param {int} id ID of delivery notice
 */
export const deleteDeliveryNoticeById = id => {
  return inteluck.delete(`/v1/wms/Warehouse/Delivery_Notice/${id}`);
}


/**
 * Fetch Delivery Notice list
 * 
 * @param {object} params Set of data
 */
export const fetchDeliveryNotices = params => dispatch => {
  inteluck.get('/v1/wms/Warehouse/Delivery_Notice', { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: FETCH_DELIVERY_NOTICES,
        payload: {
          data: _.mapKeys(response.data, 'unique_code'),
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
};


/**
 * For Search Delivery Notice
 * 
 * @param {object} params Query data
 */
export const fetchDeliveryNoticeByName = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Delivery_Notice`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_DELIVERY_NOTICE,
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
 * For fetch single delivery notice by unique code
 * 
 * @param {object} params Query data
 */
 export const fetchDeliveryNoticeByCode = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Delivery_Notice`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_DELIVERY_NOTICE,
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
 * Delivery Notice files upload
 * 
 * @param {int} id ID of delivery notice
 * @param {array} files Array of files
 * @param {string} type Type of files
 */
export const uploadDeliveryNoticeFilesById = (deliveryNoticeId, files, type, folderId) => {
  const formData = new FormData();
  files.map(file => formData.append('Docs', file));
  const uploadParams = {
      id: folderId,
      delivery_notice_id: deliveryNoticeId,
      delivery_notice_document_type: type
  }

  return inteluck.post(`/v1/wms/Warehouse/Delivery_Notice-File-Upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: uploadParams
  });
}
