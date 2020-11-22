import createDataContext from "../context/createDataContext";
import { setLotusVersion, setMissingDependencies } from '../actions/lotus';
import { LOTUS_VERSION, MISSING_DEPENDENCIES } from "../actions/types";

const initialState = {
  updateAvailable: false,
  missingDependencies: [],
  lotusVersion: null
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
    default:
      return state;
  }
};

export const { Context, Provider } = createDataContext(
  reducer,
  {
    setLotusVersion,
    setMissingDependencies
  },
  initialState
);
