import _ from 'lodash';
import inteluck from 'api/inteluck';
import { FETCH_WAREHOUSES, FETCH_WAREHOUSE, THROW_ERROR } from './types';
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

export const updateWarehouseById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/${id}`, params);
}

export const updateUserById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/Contact-Details/${id}`, params);
}

export const deleteWarehouseById = id => {
  return inteluck.delete(`/v1/wms/Warehouse/Warehouse-Client/${id}`);
}

export const deleteWarehouseFilesById = id => {
  return inteluck.delete(`/v1/wms/Warehouse/Warehouse-Document-File/${id}`);
}

export const uploadWarehouseFilesById = (id, files) => {
  const formData = new FormData();
  files.map(file => formData.append('Docs', file));

  return inteluck.post(`/v1/wms/Warehouse/Warehouse-File-Upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      warehouse_id: id,
      document_type: 'warehouse_docs'
    }
  });
}
