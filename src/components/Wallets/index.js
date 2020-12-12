import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../reducer/store';
import WalletList from './WalletList';
import { getWallets } from '../../actions/wallets';
import { getLotusToken } from '../../actions/lotus';

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
    getLotusToken();
  }, [lotusToken]);

  const fetchWallets = async () => {
    const walletsToShow = await getWallets(lotusToken);
    setWallets(walletsToShow);
  }
  return (
    <div className="flex-container">
      <h1>Wallets</h1>
      <WalletList wallets={wallets} />
    </div>
  )
}

export default Wallets
