import React, { useContext, useState, useEffect } from 'react';
import Logo from '../assets/img/logo_transparent.png';
import Lotus from './Lotus';
import { Context } from '../reducer/store';

const Main = () => {
  const { state } = useContext(Context);
  const [launching, setLaunching] = useState(false);
  const [running, setRunning] = useState(false);
  const [allowStart, setAllowStart] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const { lotusVersion, launchUpdateText, lotusState, missingDependencies } = state;

  useEffect(() => {
    window.ipcRenderer.on('Upgrade complete', (event, message) => {
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
    } 
  }, [launchUpdateText]);

  const handleUpgrade = () => {
    window.ipcRenderer.send('Upgrade lotus');
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
      console.log(window.ipcRenderer);
      window.ipcRenderer.send("launch");
    } catch (error) {
      setLaunching(false);
    }
  }
  const restartNode = () => {
    window.ipcRenderer.send("re-launch");
  }

  const checkDependencies = () => {
    window.ipcRenderer.send('Check dependencies');
  }

  const openBrew = () => {
    window.ipcRenderer.send('Open link', "https://brew.sh")
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
  } else {
    return (
      <div className='flex-container'>
        {
          launching ? 
          <div>
            <h1>{launchUpdateText}</h1> 
            { 
              launchUpdateText === 'Error' &&  
              <button className='btn btn-primary' onClick={restartNode}>Try Again</button>
            }
          </div>
          : 
          running ? 
          <div>
            <h1>Your lotus node is now running!</h1>
          </div> :
          <div>
            { 
              state.updateAvailable && <LotusUpgradeAvailable />
            }
            <div className='floating-version'>
              <p>{lotusVersion && `Lotus Version: ${lotusVersion}`}</p>
            </div>
            <img className='logo' src={Logo} alt='Nelumbo logo' />
            <h1>Create your local Lotus blockchain with one click</h1>
            <button onClick={handleLaunch} className='btn btn-primary'>Launch</button>
          </div>
        }
      </div>
    )
  }
}

export default Main;