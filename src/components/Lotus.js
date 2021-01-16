import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../reducer/store';
import Wallets from './Wallets/';
import Explorer from './Explorer/';
import Navigation from './Navigation';
import { getLotusToken } from '../actions/lotus';
import API from './API/index';

const Lotus = () => {
  const [page, setPage] = useState("wallets");

  const renderPage = () => {
    switch(page) {
      case "wallets": 
        return <Wallets />;
      case "explorer": 
        return <Explorer />;
      case "api": 
        return <API />;
      default: 
        return <Wallets />;
    }
  }
  return (
    <div style={styles.main}>
      <Navigation setPage={setPage} page={page} />
      {renderPage()}
    </div>
  )
}

const styles = {
  main: {
    marginBottom: 50
  }
}

export default Lotus
