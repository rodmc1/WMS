import _ from 'lodash';
import inteluck from 'api/inteluck';
import { THROW_ERROR, FETCH_WAREHOUSE_CLIENTS, FETCH_WAREHOUSE_CLIENT, FETCH_CLIENT_SKU, SEARCH_CLIENT, SEARCH_CLIENT_SKU, FETCH_CLIENT_LOGS, SEARCH_CLIENT_LOGS } from './types';
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

/**
 * For Search Client
 * 
 * @param {object} params Query data
 */
 export const searchClient = params => dispatch => {
  inteluck.get(`/v1/wms/Warehouse/Client`, { params })
    .then(response => {
      const headers = response.headers['x-inteluck-data'];
      dispatch({
        type: SEARCH_CLIENT,
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
export const fetchAllWarehouseClient = () => {
  return inteluck.get(`/v1/wms/Warehouse/Client`);
}

// For edit warehouse
export const updateClientById = (id, params) => {
  return inteluck.patch(`/v1/wms/Warehouse/Client/${id}`, params);
}

// For SKU tagging
export const tagSKU = (id, addedItems, removedItems) => {
  let params = {}
  let status = false;
  let arrayOfRequest = [];
  addedItems.forEach(itemID => {
    params = {
      client_id: id,
      item_id: itemID
    }
    arrayOfRequest.push(inteluck.post(`/v1/wms/Warehouse/Client-SKU?client_id=${params.client_id}&item_id=${params.item_id}&isactive=${true}`))
  });

  removedItems.forEach(itemID => {
    params = {
      client_id: id,
      item_id: itemID
    }
    arrayOfRequest.push(inteluck.post(`/v1/wms/Warehouse/Client-SKU?client_id=${params.client_id}&item_id=${params.item_id}&isactive=${false}`))
  })

  return Promise.all(arrayOfRequest);
}

// For remove tagged sku
export const removeTaggedSKU = (id, itemID) => {
  return inteluck.post(`/v1/wms/Warehouse/Client-SKU?client_id=${id}&item_id=${itemID}&isactive=${false}`)
}

/**
 * Fetch Audit Logs
 * 
 * @param {object} params Set of data
 */
 export const fetchClientLogs = () => dispatch => {
  const params = { target_object: 'warehouse_client' };

  inteluck.get('/v1/wms/Warehouse/Logs', { params })
    .then(response => {
      dispatch({
        type: FETCH_CLIENT_LOGS,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
};

/**
 * Fetch filtered Audit Logs
 * 
 * @param {object} params Set of data
 */
 export const fetchfilteredClientAuditLog = (query, date) => dispatch => {
  const params =  query || date ? { filter: query, date, target_object: 'warehouse_client' } : { target_object: 'warehouse_client' };

  inteluck.get('/v1/wms/Warehouse/Logs', { params })
    .then(response => {
      dispatch({
        type: SEARCH_CLIENT_LOGS,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    }); 
};

// Create warehouse
export const createWarehouseClient = params => {
  return inteluck.post(`/v1/wms/Warehouse/Client`, params);
}

// Client Image upload
export const uploadClientImageById = (id, files) => {
  const formData = new FormData();
  files.map(file => formData.append('Docs', file));

  return inteluck.post(`/v1/wms/Warehouse/Client/Image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      id: id
    }
  });
}
