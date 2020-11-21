import React, { createContext, useReducer } from 'react';

const Context = createContext();

const CreateDataContext = (reducer, actions, initialState) => {

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const boundActions = {};

    for(let key in actions) {
      boundActions[key] = actions[key](dispatch)
    }

    return <Context.Provider value={{ state, ...boundActions }}>{children}</Context.Provider>
  }

  return { Context, Provider };
}

export default CreateDataContext;