import React, { useContext, useState, useEffect } from 'react';
import Logo from '../assets/img/logo_transparent.png';
import Lotus from './Lotus';
import { Context } from '../reducer/store';
import { getLotusToken } from '../actions/lotus';
import Configure from './Configure';
const { ipcRenderer } = window.require("electron");

const Main = () => {
  const { state } = useContext(Context);
  const [launching, setLaunching] = useState(false);
  const [running, setRunning] = useState(false);
  const [allowStart, setAllowStart] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [configure, setConfigure] = useState(false);
  const { lotusVersion, launchUpdateText, lotusState, missingDependencies } = state;
  useEffect(() => {
    ipcRenderer.on('Upgrade complete', (event, message) => {
      setUpgrading(false)
    });
  })
  useEffect(() => {
    const brewMissing = missingDependencies.filter((dep) => dep.reason === "brew").length > 0;
    if(brewMissing) {
      setAllowStart(false);
    }
  }, [missingDependencies]);
  useEffect(() => {
    if(launchUpdateText === 'Done') {
      setLaunching(false);
      setRunning(true);
      getLotusToken();
    } 
  }, [launchUpdateText]);

  const handleUpgrade = () => {
    ipcRenderer.send('Upgrade lotus');
    setUpgrading(true);
  }

  const LotusUpgradeAvailable = () => {
    return (
      <div className='update-available'>
        <button onClick={handleUpgrade} className='no-btn'><h3>Update Available</h3></button>      
      </div>
    )
  }

  const handleLaunch = () => {
    try {
      setLaunching(true);
      ipcRenderer.send("launch");
    } catch (error) {
      setLaunching(false);
    }
  }
  const restartNode = () => {
    ipcRenderer.send("re-launch");
  }

  const checkDependencies = () => {
    ipcRenderer.send('Check dependencies');
  }

  const openBrew = () => {
    ipcRenderer.send('Open link', "https://brew.sh")
  }

  if(allowStart === false) {
    return (
      <div className='flex-container'>
        <h1>Homebrew is required to run Nelumbo</h1>
        <p>You can install it <a style={{ textDecoration: 'underline', cursor: 'pointer'}} onClick={openBrew}>here</a>. Once it's installed, click the button below.</p>
        <button className='btn btn-primary' onClick={checkDependencies}>Get Started</button>
      </div>
    )
  } else if(upgrading) {
    return (
      <div className='flex-container'>
        <h1>Upgrading Lotus Version...</h1>
      </div>
    )
  } else if(lotusState) {
    return (
      <Lotus />
    )
  } else if(configure) {
    return <Configure setConfigure={setConfigure} />
  } else {
    return (
      <div>
        {
          launching ? 
          <div className='flex-container'>
            <h1>{launchUpdateText}</h1> 
            { 
              launchUpdateText === 'Error' &&  
              <button className='btn btn-primary' onClick={restartNode}>Try Again</button>
            }
          </div>
          : 
          running ? 
          <Lotus /> :
          <div className='flex-container'>
            { 
              state.updateAvailable && <LotusUpgradeAvailable />
            }
            <div className='floating-version'>
              <p>{lotusVersion && `Lotus Version: ${lotusVersion}`}</p>
            </div>
            <div className='floating-version'>
              <p>{lotusVersion && `Lotus Version: ${lotusVersion}`}</p>
            </div>
            <img className='logo' src={Logo} alt='Nelumbo logo' />
            <h1>Create your local Lotus blockchain with one click</h1>
            <button onClick={handleLaunch} className='btn btn-primary'>Launch</button>
            <button style={{marginTop: 10, marginBottom: 10}} className="btn btn-secondary" onClick={() => setConfigure(true)}>Configure</button>
            <span>Any configuration should be done before launching.</span>
          </div>
        }
      </div>
    )
  }
}

export default Main;