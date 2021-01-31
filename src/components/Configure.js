import React, { useState, useEffect } from 'react'
const TOML = require('@iarna/toml');
const json2toml = require('json2toml');

const Configure = ({ setConfigure }) => {
  const [newConfig, setNewConfig] = useState(null);
  const [ipfsModal, setIPFSModal] = useState(false);
  useEffect(() => {
    var data = TOML.parse(`# Default config:
    [API]
    ListenAddress = "/ip4/127.0.0.1/tcp/1234/http"
    RemoteListenAddress = ""
    Timeout = "30s"
    #
    [Libp2p]
    ListenAddresses = ["/ip4/0.0.0.0/tcp/0", "/ip6/::/tcp/0"]
    AnnounceAddresses = []
    NoAnnounceAddresses = []
    ConnMgrLow = 150
    ConnMgrHigh = 180
    ConnMgrGrace = "20s"
    #
    [Pubsub]
    Bootstrapper = false
    RemoteTracer = "/dns4/pubsub-tracer.filecoin.io/tcp/4001/p2p/QmTd6UvR47vUidRNZ1ZKXHrAFhqTJAD27rKL9XYghEKgKX"
    #
    [Client]
    UseIpfs = false
    IpfsOnlineMode = false
    IpfsMAddr = ""
    IpfsUseForRetrieval = false
    SimultaneousTransfers = 20
    #
    [Metrics]
    Nickname = ""
    HeadNotifs = false
    #
    [Wallet]
    RemoteBackend = ""
    EnableLedger = false
    DisableLocal = false
    #
    [Fees]
    DefaultMaxFee = "0.007 FIL"
    #`);
    console.dir(data);
    setNewConfig(data);
  }, []);

  const handleChange = (e, h, k) => {
    let updatedConfig = JSON.parse(JSON.stringify(newConfig));

    if(e.target.value.toLowerCase() === "true") {
      updatedConfig[h][k] = true;
    } else if(e.target.value.toLowerCase() === "false") {
      updatedConfig[h][k] = false;
    } else {
      updatedConfig[h][k] = e.target.value;
    }    

    setNewConfig(updatedConfig);
  }

  const handleSave = (e, confirm) => {
    const keys = Object.keys(newConfig);
    
    for(const key of keys) {
      const subKeys = Object.keys(newConfig[key]);
      for(const subKey of subKeys) {
        if(!newConfig[key][subKey]) {
          delete newConfig[key][subKey]          
        }
      }
    }
    if(newConfig.Client.UseIpfs && !confirm) {      
      setIPFSModal(true);
    } else {
      window.ipcRenderer.send('Update Config', json2toml(newConfig));
      window.ipcRenderer.send("Start IPFS");
      setConfigure(false);
    }    
  }

  if(ipfsModal) {
    return (
      <div className="confirm-ipfs">
        <h3>Start IPFS</h3>
        <p>You've chosen to integrate IPFS with your Filecoin node. You will need to make sure IPFS is installed on your machine.</p>
        <p>By clicking confirm, IPFS will start automatically, assuming it is installed.</p>
        <button onClick={(e) => handleSave(e, true)} className="btn btn-primary">Confirm</button>
        <button className="btn btn-secondary">Cancel</button>
      </div>
    )
  }

  return (
    <div className='configure-lotus'>
      <h3>Configure</h3>
      {
        newConfig && 
        Object.keys(newConfig).map((heading) => {
          return (
            <div key={heading}>
              <h3 style={{textDecoration: "underline"}}>{heading}</h3>
              {
                Object.keys(newConfig[heading]).map((k) => {
                  return (
                    <div className="flex-row" key={k}>
                      <p>{k}</p>
                      <input onChange={(e) => handleChange(e, heading, k)} type="text" value={newConfig[heading][k]} />
                    </div>                    
                  )
                })
              }              
            </div>
          )
        })
      }
      <button onClick={handleSave} className="btn btn-primary">Save</button>
    </div>
  )
}

export default Configure
