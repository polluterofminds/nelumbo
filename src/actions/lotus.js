import { LOTUS_VERSION, MISSING_DEPENDENCIES } from './types';

export const setLotusVersion = (dispatch) => {
  return (lotusVersion, updateAvailable) => {
    dispatch({
      type: LOTUS_VERSION, 
      payload: {lotusVersion, updateAvailable}
    });
  }
}

export const setMissingDependencies = (dispatch) => {
  return (missingDependencies) => {
    dispatch({
      type: MISSING_DEPENDENCIES, 
      payload: missingDependencies
    });
  }
}