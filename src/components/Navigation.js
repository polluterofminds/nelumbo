import React from 'react'

const Navigation = ({ setPage, page }) => {
  return (
    <div>
      <ul style={styles.menu}>
        <li onClick={() => setPage('wallets')} style={page === 'wallets' ? styles.active : styles.inactive}>
          Wallets
        </li>
        <li onClick={() => setPage('explorer')} style={page === 'explorer' ? styles.active : styles.inactive}>
          Explorer
        </li>
        <li onClick={() => setPage('api')} style={page === 'api' ? styles.active : styles.inactive}>
          API
        </li>
      </ul>
    </div>
  )
}

const styles = {
  active: {
    textDecoration: "underline",
    cursor: "pointer",
    display: "inline",
    margin: 10
  },
  inactive: {
    cursor: "pointer", 
    display: "inline",
    margin: 10
  }, 
  menu: {
    listStyle: 'none',
    textAlign: 'center',
    marginTop: 25
  }
}

export default Navigation
