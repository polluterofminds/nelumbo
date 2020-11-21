import React from 'react'
import Logo from '../assets/img/logo_transparent.png';

const Main = () => {
  return (
    <div className='flex-container'>
      <img className='logo' src={Logo} alt='Nelumbo logo' />
      <h1>Create your local Lotus blockchain with one click</h1>
      <button className='btn btn-primary'>Launch</button>
    </div>
  )
}

export default Main;