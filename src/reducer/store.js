import createDataContext from "../context/createDataContext";
import {

} from "../actions/types";

const initialState = {

};

export const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const { Context, Provider } = createDataContext(
  reducer,
  {

  },
  initialState
);
