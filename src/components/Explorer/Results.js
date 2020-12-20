import React, { useState } from 'react'

const Results = ({ transactions, filteredTransactions, filterTransactions }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    filterTransactions(e.target.value, transactions);
  }
  return (
    <div style={styles.container}>
      <input style={styles.input} type="text" value={search} onChange={handleSearch} placeholder="Enter a message CID, wallet address, or miner ID" />
      <table>
        <thead>
          <tr>
            <td>From</td>
            <td>To</td>
            <td>Message</td>
            <td>Gas Fee Cap</td>
            <td>Gas Limit</td>
            <td>Gas Premium</td>
          </tr>
        </thead>
        <tbody>
          {
            filteredTransactions.map(t => {
              return (
                <tr key={t.CID["/"]}>
                  <td>{t.From.substring(0, 10)} {t.From.length > 10 && "..."}</td>
                  <td>{t.To.substring(0, 10)} {t.To.length > 10 && "..."}</td>
                  <td>{t.CID["/"].substring(0, 15)}...</td>
                  <td>{t.GasFeeCap}</td>
                  <td>{t.GasLimit}</td>
                  <td>{t.GasPremium}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )  
}

const styles = {
  container: {
    maxWidth: "75%",
    margin: "auto"
  }, 
  input: {
    width: 350,
    padding: 10,
    marginBottom: 20
  }
}

export default Results
