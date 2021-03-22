import inteluck from 'api/inteluck';
import { FETCH_FACILITIES_AND_AMENITIES, FETCH_BUILDING_TYPES, THROW_ERROR } from './types';
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