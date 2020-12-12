import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../reducer/store';
import WalletList from './WalletList';
import { getWallets } from '../../actions/wallets';

const Wallets = () => {
  const { state, setLotusToken } = useContext(Context);
  const [wallets, setWallets] = useState([]);
  const { lotusToken } = state;

  useEffect(() => {
    window.ipcRenderer.on("received-token", (event, message) => {
      setLotusToken(message);    
    });
  })

  useEffect(() => {
    if(lotusToken) {
      fetchWallets();
    }    
  }, [wallets, lotusToken]);

  const fetchWallets = async () => {
    const walletsToShow = getWallets();
  }
  return (
    <div className="flex-container">
      <h1>Wallets</h1>
      <WalletList wallets={wallets} />
    </div>
  )
}

export default Wallets
