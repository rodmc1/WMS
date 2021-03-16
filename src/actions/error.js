import { THROW_ERROR } from './types';

export const throwError = (error) => {
  return {
    type: THROW_ERROR,
    payload: error
  }
}