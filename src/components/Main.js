import React, { useContext, useState, useEffect } from 'react';
import Logo from '../assets/img/logo_transparent.png';
import Lotus from './Lotus';
import { Context } from '../reducer/store';

const Main = () => {
  const { state } = useContext(Context);
  const [launching, setLaunching] = useState(false);
  const [running, setRunning] = useState(false);
  const [allowStart, setAllowStart] = useState(true);
  const { lotusVersion, launchUpdateText, lotusState, missingDependencies } = state;

  useEffect(() => {
    console.log(missingDependencies)
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

  if(allowStart === false) {
    return (
      <div className='flex-container'>
        <h1>Homebrew is required to run Nelumbo</h1>
        <p>You can install it <a href='https://brew.sh/'>here</a>. Once it's installed, click the button below.</p>
        <button className='btn btn-primary' onClick={checkDependencies}>Get Started</button>
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