import { ERROR } from "config/constants";

export const dispatchError = (dispatch, type, error) => {
  if (error.response) {
    dispatch({ type, payload: error.response });
  } else {
    dispatch({ type, payload: ERROR.DEFAULT_CODE });
  }
}