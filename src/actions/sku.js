import { FETCH_WAREHOUSE_SKUS, THROW_ERROR, SEARCH_SKU } from './types';
import _ from 'lodash';
import inteluck from 'api/inteluck';
import { dispatchError } from 'helper/error';

export const fetchWarehouseSKUs = params => dispatch => {
  inteluck.get('/v1/wms/Warehouse/Item', { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: FETCH_WAREHOUSE_SKUS,
        payload: {
          data: _.mapKeys(response.data, 'item_id'),
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
}

// For Search Warehouse
export const fetchSKUByName = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Item`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_SKU,
        payload: {
          data: response.data,
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

// For SKU Add Items
export const searchWarehouseSKUByName = params => {
  // console.log(params)
  return inteluck.get(`/v1/wms/Warehouse/Item`, { params })
}

// for Download CSV
export const fetchAllWarehouseSKUs = params => {
  return inteluck.get('/v1/wms/Warehouse/Item', { params })
}

// For SKU List
// export const fetchSKUByWarehouseId = params => dispatch => {
//   inteluck.get(`/v1/wms/Warehouse/Item`, { params })
//     .then(response => {
//       const headers = response.headers['x-inteluck-data'];
//       dispatch({
//         type: SEARCH_SKU,
//         payload: {
//           data: response.data,
//           count: Number(JSON.parse(headers).Count)
//         }
//       });
//     }).catch(error => {
//       dispatchError(dispatch, THROW_ERROR, error);
//     });
// }

export const createWarehouseSKU = params => {
  return inteluck.post(`/v1/wms/Warehouse/Item`, params);
}

// For edit warehouse
export const updateWarehouseSKU = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/Item/${id}`, params);
}

// Warehouse SKU photos delete
export const deleteSKUPhotosById = id => {
  return inteluck.delete(`/v1/wms/Warehouse/Item/${id}`);
}

// SKU files upload
export const uploadSKUFilesById = (itemId, documentId, files) => {
  const formData = new FormData();
  files.map(file => formData.append('Docs', file));
  
  return inteluck.post(`/v1/wms/Warehouse/Item-File-Upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      item_id: itemId,
      id: documentId,
      item_document_type: 'Photos'
    }
  });
}
