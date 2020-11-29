import { LOTUS_VERSION, MISSING_DEPENDENCIES, LAUNCH_UPDATE, LOTUS_STATE } from './types';

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

export const setUpdateText = (dispatch) => {
  return (update) => {
    dispatch({
      type: LAUNCH_UPDATE, 
      payload: update
    })
  }
}

export const setStatus = (dispatch) => {
  return (status) => {
    dispatch({
      type: LOTUS_STATE, 
      payload: status
    })
  }
}