import React, { useContext } from 'react';
import Logo from '../assets/img/logo_transparent.png';
import { Context } from '../reducer/store';

const Main = () => {
  const { state } = useContext(Context);
  const { lotusVersion } = state;
  console.log(state)
  return (
    <div className='flex-container'>
      <div className='floating-version'>
        <p>{lotusVersion && `Lotus Version: ${lotusVersion}`}</p>
      </div>
      <img className='logo' src={Logo} alt='Nelumbo logo' />
      <h1>Create your local Lotus blockchain with one click</h1>
      <button className='btn btn-primary'>Launch</button>
    </div>
  )
}

export default Main;