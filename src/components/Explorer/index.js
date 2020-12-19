import React, { useContext, useEffect } from 'react';
import Results from './Results';
import { Context } from '../../reducer/store';

const Explorer = () => {
  const { state, fetchRecentTransactions } = useContext(Context);
  const { lotusToken } = state;
  useEffect(() => {
    fetchRecentTransactions(lotusToken);
  }, [])
  return (
    <div>
      <div>
        <input type="text" />
        <Results />
      </div>
    </div>
  )
}

export default Explorer
