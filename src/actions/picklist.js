import inteluck from 'api/inteluck';
import { FETCH_RECEIVED_DOCUMENT_TYPE, FETCH_FACILITIES_AND_AMENITIES, FETCH_BUILDING_TYPES, FETCH_TRUCK_TYPES, THROW_ERROR, FETCH_CLIENTS, FETCH_UOM, FETCH_STORAGE_TYPE, FETCH_PROJECT_TYPE } from './types';
import { dispatchError } from 'helper/error';

export const fetchFacilitiesAndAmenities = id => dispatch => {
  inteluck.get(`/v1/SysObjects/PickLists/facilities_and_amenities`)
    .then(response => {
      dispatch({
        type: FETCH_FACILITIES_AND_AMENITIES,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error)
    })
}

export const fetchBuildingTypes = id => dispatch => {
  inteluck.get(`/v1/SysObjects/PickLists/building_type`)
    .then(response => {
      dispatch({
        type: FETCH_BUILDING_TYPES,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error)
    })
}

export const fetchTruckTypes = id => dispatch => {
  inteluck.get(`/v1/SysObjects/PickLists/asset_category`)
    .then(response => {
      dispatch({
        type: FETCH_TRUCK_TYPES,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error)
    })
}

export const fetchClients = id => dispatch => {
  inteluck.get(`/v1/Clients`, { 
    params: {
      count: 500,
      type: 'SHIPPER'
    }})
    .then(response => {
      dispatch({
        type: FETCH_CLIENTS,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error)
    })
}

export const fetchUOM = id => dispatch => {
  inteluck.get(`/v1/SysObjects/PickLists/uom`)
    .then(response => {
      dispatch({
        type: FETCH_UOM,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error)
    })
}

export const fetchStorageType = id => dispatch => {
  inteluck.get(`/v1/SysObjects/PickLists/storage_type`)
    .then(response => {
      dispatch({
        type: FETCH_STORAGE_TYPE,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error)
    })
}

export const fetchReceivedDocumentType = id => dispatch => {
  inteluck.get(`/v1/SysObjects/PickLists/received_document_type`)
    .then(response => {
      dispatch({
        type: FETCH_RECEIVED_DOCUMENT_TYPE,
        payload: response.data[0]
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error)
    })
}

export const fetchProjectType = id => dispatch => {
  inteluck.get(`/v1/SysObjects/PickLists/project_type`)
    .then(response => {
      dispatch({
        type: FETCH_PROJECT_TYPE,
        payload: response.data
      });
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error)
    })
}

export const fetchAccountDetails = () => {
  return inteluck.get(`v1/Accounts`);
}