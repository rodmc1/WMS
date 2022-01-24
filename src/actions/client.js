import _ from 'lodash';
import inteluck from 'api/inteluck';
import { THROW_ERROR, FETCH_WAREHOUSE_CLIENTS, FETCH_WAREHOUSE_CLIENT, FETCH_CLIENT_SKU } from './types';
import { dispatchError } from 'helper/error';

// Fetch warehouse for warehouse list
export const fetchWarehouseClients = params => dispatch => {
  inteluck.get('/v1/wms/Warehouse/Client', { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: FETCH_WAREHOUSE_CLIENTS,
        payload: {
          data: _.mapKeys(response.data, 'client_name'),
          count: Number(JSON.parse(headers).Count)
        }
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
};

// For fetching single client
export const fetchWarehouseClient = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Client`, { params })
    .then(response => {
      dispatch({
        type: FETCH_WAREHOUSE_CLIENT,
        payload: response.data[0]
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

// For fetching sku tag
export const fetchClientSKU = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Client-SKU/Get`, { params })
    .then(response => {
      dispatch({
        type: FETCH_CLIENT_SKU,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
}

// For All warehouse for down CSV
export const fetchAllWarehouseClient = () => {
  return inteluck.get(`/v1/wms/Warehouse/Client`);
}

// For edit warehouse
export const updateClientById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/Client/${id}`, params);
}


// For Audit Log
// export const fetchAuditLogByWarehouse = (warehouseId, params) => dispatch => {
//   inteluck.get(`/v1/wms/Warehouse/${warehouseId}/Logs`, { params })
//     .then(response => {
//       const headers = response.headers['x-inteluck-data'];
//       dispatch({
//         type: SEARCH_WAREHOUSE,
//         payload: {
//           data: response.data,
//           count: Number(JSON.parse(headers).Count)
//         }
//       });
//     }).catch(error => {
//       dispatchError(dispatch, THROW_ERROR, error);
//     });
// }

// For All warehouse for down CSV
// export const fetchAllWarehouse = () => {
//   return inteluck.get(`/v1/wms/Warehouse`);
// }

// Create warehouse
export const createWarehouseClient = params => {
  return inteluck.post(`/v1/wms/Warehouse/Client`, params);
}

// For edit warehouse
// export const updateWarehouseById = (id, params) => {
//   return inteluck.patch(`/v1/wms/Warehouse/${id}`, params);
// }

// For User info update
// export const updateUserById = (id, params) => {
//   return inteluck.patch(`/v1/wms/Warehouse/Contact-Details/${id}`, params);
// }

// For Delete Warehouse
// export const deleteWarehouseById = id => {
//   return inteluck.delete(`/v1/wms/Warehouse/Warehouse-Client/${id}`);
// }