import _ from 'lodash';
import inteluck from 'api/inteluck';
import { FETCH_WAREHOUSES, FETCH_WAREHOUSE, THROW_ERROR, SEARCH_WAREHOUSE } from './types';
import { dispatchError } from 'helper/error';

// Fetch warehouse for warehouse list
export const fetchWarehouses = params => dispatch => {
  inteluck.get('/v1/wms/Warehouse', { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: FETCH_WAREHOUSES,
        payload: {
          data: _.mapKeys(response.data, 'warehouse_client'),
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
};

// Fetch single warehouse data
export const fetchWarehouseById = id => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/`, { 
    params: {
      filter: id
    }})
    .then(response => {
      dispatch({
        type: FETCH_WAREHOUSE,
        payload: response.data[0]
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

// For Search Warehouse
export const fetchWarehouseByName = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_WAREHOUSE,
        payload: {
          data: response.data,
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

// For Audit Log
export const fetchAuditLogByWarehouse = (warehouseId, params) => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/${warehouseId}/Logs`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_WAREHOUSE,
        payload: {
          data: response.data,
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

// For All warehouse for down CSV
export const fetchAllWarehouse = () => {
  return inteluck.get(`/v1/wms/Warehouse`);
}

// Create warehouse
export const createWarehouse = params => {
  return inteluck.post(`/v1/wms/Warehouse`, params);
}

// For edit warehouse
export const updateWarehouseById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/${id}`, params);
}

// For User info update
export const updateUserById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/Contact-Details/${id}`, params);
}

// For Delete Warehouse
export const deleteWarehouseById = id => {
  return inteluck.delete(`/v1/wms/Warehouse/Warehouse-Client/${id}`);
}

// Warehouse files delete
export const deleteWarehouseFilesById = id => {
  return inteluck.delete(`/v1/wms/Warehouse/Warehouse-Document-File/${id}`);
}

// Warehouse files upload
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
