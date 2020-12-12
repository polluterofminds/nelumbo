import React from 'react';
import WalletRow from './WalletRow';

const WalletList = ({ wallets }) => {
  return (
    <div>
      {
        wallets.map(wallet => {
          return (
            <WalletRow wallet={wallet} />
          )
        })
      }
    </div>
  )
}

export default WalletList;
