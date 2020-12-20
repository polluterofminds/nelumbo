import React, { useContext, useEffect } from 'react';
import Results from './Results';
import { Context } from '../../reducer/store';

const Explorer = () => {
  const { state, fetchRecentTransactions, filterTransactions } = useContext(Context);
  const { lotusToken, transactions, filteredTransactions } = state;
  useEffect(() => {
    fetchRecentTransactions(lotusToken);
  }, [])
  return (
    <div style={{ marginTop: 50 }}>
      <div>
        <Results transactions={transactions} filteredTransactions={filteredTransactions} filterTransactions={filterTransactions} />
      </div>
    </div>
  )
}

export default Explorer
