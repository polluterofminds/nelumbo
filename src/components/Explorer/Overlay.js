import React, { useEffect, useContext, useState } from 'react'
import { getSingleMessage } from '../../actions/explorer';
import { Context } from "../../reducer/store";
const { ipcRenderer } = window.require("electron");

const Overlay = ({cid, setOverlay}) => {
  const { state, setLotusToken } = useContext(Context);
  const [messageDetails, setMessageDetails] = useState({});
  const { lotusToken } = state;
  useEffect(() => {     
    ipcRenderer.on("received-token", (event, message) => {
      setLotusToken(message);    
    });
  }, []);

  useEffect(() => {
    if(lotusToken) {
      getMessage();
    }
  }, [lotusToken])

  const getMessage = async () => {
    const message = await getSingleMessage(lotusToken, cid);
    setMessageDetails(message.result);
  }
  return (
    <div style={styles.main}>
      <div>
        <button onClick={() => setOverlay(false)} style={styles.btn}>Back</button>
      </div>
      <h2>Details</h2>
      <p>Message: {cid}</p>
      <div>
        <h4>From</h4>
        <p>{messageDetails.From}</p>
      </div>
      <div>
        <h4>Gas Fee Gap</h4>
        <p>{messageDetails.GasFeeCap}</p>
      </div>
      <div>
        <h4>Gas Limit</h4>
        <p>{messageDetails.GasLimit}</p>
      </div>
      <div>
        <h4>Gas Premium</h4>
        <p>{messageDetails.GasPremium}</p>
      </div>
      <div>
        <h4>Parameters</h4>
        <p>{messageDetails.Params}</p>
      </div>
    </div>
  )
}

const styles = {
  main: {
    maxWidth: "75%", 
    margin: "auto", 
    marginBottom: 60
  }, 
  closeContainer: {
    position: "fixed", 
    top: 50, 
    left: 15,
    zIndex: 1024
  },
  btn: {
    background: "none", 
    border: "none", 
    outline: "none", 
    cursor: "pointer", 
    color: "#fff"
  }
}

export default Overlay
