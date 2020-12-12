import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../reducer/store';
import Wallets from './Wallets/';
import Explorer from './Explorer/';
import { getLotusToken } from '../actions/lotus';

const Lotus = () => {
  const [page, setPage] = useState("Wallets");

  useEffect(() => {
    // getLotusToken();   
  }, []);

  const renderPage = () => {
    switch(page) {
      case "Wallets": 
        return <Wallets />;
      case "Explorer": 
        return <Explorer />;
      default: 
        return <Wallets />;
    }
  }
  return (
    <div>
      {renderPage()}
    </div>
  )
}

export default Lotus
