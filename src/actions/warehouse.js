import _ from 'lodash';
import inteluck from 'api/inteluck';
import { FETCH_WAREHOUSES, FETCH_WAREHOUSE, THROW_ERROR, POST_WAREHOUSE_FILES } from './types';
import { dispatchError } from 'helper/error';

export const fetchWarehouses = params => dispatch => {
  inteluck.get('/v1/wms/Warehouse', { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: FETCH_WAREHOUSES,
        payload: {
          data: _.mapKeys(response.data, 'warehouse_id'),
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
};

export const fetchWarehouseById = id => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/${id}`)
    .then(response => {
      dispatch({
        type: FETCH_WAREHOUSE,
        payload: response.data[0]
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

export const createWarehouse = params => {
  return inteluck.post(`/v1/wms/Warehouse`, params);
}

export const uploadWarehouseFiles = (id, files) => {
  const formData = new FormData();
  files.map(file => formData.append('warehouse_docs', file));

  inteluck.post(`/v1/wms/Warehouse/Warehouse-File-Upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      warehouse_id: id,
      document_type: 'warehouse_docs'
    }});
}


