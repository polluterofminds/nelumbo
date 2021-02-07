import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../reducer/store';
import WalletList from './WalletList';
import { getWallets, newWallet } from '../../actions/wallets';
import { getLotusToken } from '../../actions/lotus';
const { ipcRenderer } = window.require("electron");

const Wallets = () => {
  const { state, setLotusToken } = useContext(Context);
  const [wallets, setWallets] = useState([]);
  const { lotusToken } = state;

  useEffect(() => {
    ipcRenderer.on("received-token", (event, message) => {

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

  const createWallet = async () => {
    await newWallet(lotusToken);
    fetchWallets();
  }
  return (
    <div style={styles.container}>
      <div>
        <h1>Wallets ({wallets.length})</h1>
        <button onClick={createWallet} style={styles.btn} className="btn btn-primary">Create Wallet</button>
      </div>
      <WalletList wallets={wallets} />
    </div>
  )
}

const styles = {
  btn: {
    marginTop: 25, 
    marginLeft: 20, 
    width: 150
  },
  container: {
    height: "100%",
    paddingLeft: "7.5%",
    paddingRight: "7.5%", 
    marginTop: 0
  }
}

export default Wallets
