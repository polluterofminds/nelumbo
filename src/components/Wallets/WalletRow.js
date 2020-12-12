import React from 'react'

const WalletRow = ({ wallet }) => {
  return (
    <div style={styles.walletRowContainer}>
      <div style={styles.column}>
        <h6>Address</h6>
        <p style={styles.tableFont}>{wallet.wallet}</p>
      </div>
      <div style={styles.column}>
        <h6>Balance</h6>
        <p style={styles.tableFont}>{wallet.balance}</p>
      </div>
    </div>
  )
}

const styles = {
  walletRowContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  }, 
  column: {
    textAlign: 'left', 
    padding: 10
  }, 
  tableFont: {
    fontSize: 14
  }
}

export default WalletRow;