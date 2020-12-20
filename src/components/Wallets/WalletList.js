import React from 'react';
import WalletRow from './WalletRow';

const WalletList = ({ wallets }) => {
  return (
    <div>
      {
        wallets.sort((a, b) => (a.balance > b.balance) ? 1 : -1).map(wallet => {
          return (
            <WalletRow key={wallet.wallet} wallet={wallet} />
          )
        })
      }
    </div>
  )
}

export default WalletList;
