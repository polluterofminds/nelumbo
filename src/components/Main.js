import React, { useContext, useState, useEffect } from 'react';
import Logo from '../assets/img/logo_transparent.png';
import Lotus from './Lotus';
import { Context } from '../reducer/store';

const Main = () => {
  const { state } = useContext(Context);
  const [launching, setLaunching] = useState(false);
  const [running, setRunning] = useState(false);
  const { lotusVersion, launchUpdateText, lotusState } = state;

  useEffect(() => {
    if(launchUpdateText === 'Done') {
      setLaunching(false);
      setRunning(true);
    } 
  }, [launchUpdateText])
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

  if(lotusState) {
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
              <button onClick={restartNode}>Try Again</button>
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