import createDataContext from "../context/createDataContext";
import { setLotusVersion, setMissingDependencies, setUpdateText, setStatus, setLotusToken } from '../actions/lotus';
import { LOTUS_VERSION, MISSING_DEPENDENCIES, LAUNCH_UPDATE, LOTUS_STATE, LOTUS_TOKEN } from "../actions/types";

const initialState = {
  updateAvailable: false,
  missingDependencies: [],
  lotusVersion: null, 
  launchUpdateText: null, 
  lotusState: null, 
  lotusToken: null
};

export const reducer = (state, action) => {
  switch (action.type) {
    case LOTUS_VERSION: 
      return {
        ...state,
        lotusVersion: action.payload.lotusVersion, 
        updateAvailable: action.payload.updateAvailable
      }
    case MISSING_DEPENDENCIES: 
      return {
        ...state, 
        missingDependencies: action.payload
      }
    case LAUNCH_UPDATE: 
      return {
        ...state, 
        launchUpdateText: action.payload
      }
    case LOTUS_STATE: 
      return {
        ...state, 
        lotusState: action.payload
      }
    case LOTUS_TOKEN: 
      return {
        ...state, 
        lotusToken: action.payload
      }
    default:
      return state;
  }
};

export const { Context, Provider } = createDataContext(
  reducer,
  {
    setLotusVersion,
    setMissingDependencies,
    setUpdateText, 
    setStatus, 
    setLotusToken
  },
  initialState
);
