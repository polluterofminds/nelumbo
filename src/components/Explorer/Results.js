import React, { useState } from 'react'
import { createCSV } from '../../actions/explorer';
import Overlay from './Overlay';

const Results = ({ transactions, filteredTransactions, filterTransactions }) => {
  const [search, setSearch] = useState("");
  const [overlay, setOverlay] = useState(false);
  const [cidHash, setCidHash] = useState("");
  const handleSearch = (e) => {
    setSearch(e.target.value);
    filterTransactions(e.target.value, transactions);
  }

  const handleMessageClick = (cid) => {
    setOverlay(true);
    setCidHash(cid);
  }

  const handleExport = async () => {
    const newTransactionList = JSON.parse(JSON.stringify(filteredTransactions));
    createCSV(newTransactionList);
  }

  if(overlay) {
    return <Overlay cid={cidHash} setOverlay={setOverlay} />
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <input style={styles.input} type="text" value={search} onChange={handleSearch} placeholder="Enter a message CID, wallet address, or miner ID" />
        <button onClick={handleExport} className="btn btn-primary">Export</button>
      </div>     
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
                  <td onClick={() => handleMessageClick(t.CID["/"])} style={styles.link}>{t.CID["/"].substring(0, 15)}...</td>
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
  },
  link: {
    cursor: "pointer", 
    textDecoration: "underline", 
    color: "#026863"
  },
  topBar: {
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between"
  }
  
}

export default Results
