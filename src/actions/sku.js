import { FETCH_WAREHOUSE_SKUS, THROW_ERROR } from './types';
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