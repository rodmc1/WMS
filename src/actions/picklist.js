import inteluck from 'api/inteluck';
import { FETCH_FACILITIES_AND_AMENITIES, FETCH_BUILDING_TYPES, FETCH_TRUCK_TYPES, THROW_ERROR, FETCH_CLIENTS } from './types';
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
      type: 'TRUCKER'
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
