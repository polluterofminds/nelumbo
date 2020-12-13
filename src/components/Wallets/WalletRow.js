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
        <p style={styles.tableFont}>{wallet.balance.toFixed(2)}</p>
      </div>
    </div>
  )
}

const styles = {
  walletRowContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 0, 
    marginBottom: 0,
    borderBottom: "1px solid #eee"
  }, 
  column: {
    textAlign: 'left', 
    paddingLeft: 10,
    paddingRight: 10,
  }, 
  tableFont: {
    fontSize: 14
  }
}

export default WalletRow;