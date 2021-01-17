import React from "react";

const APISidebar = ({ docsToDisplay, setDocs }) => {
  return (
    <div className="api-sidebar">
      <ul>
        <li style={docsToDisplay === "GettingStarted" ? styles.active : styles.inactive} onClick={() => setDocs("GettingStarted")}>Getting Started</li>
        <li>
          <span style={styles.sectionHeader}>Authentication</span>
          <ul>
            <li style={docsToDisplay === "AuthNew" ? styles.active : styles.inactive} onClick={() => setDocs("AuthNew")}>AuthNew</li>
            <li style={docsToDisplay === "AuthVerify" ? styles.active : styles.inactive} onClick={() => setDocs("AuthVerify")}>AuthVerify</li>
          </ul>
        </li>
        <li>
          <span style={styles.sectionHeader}>Chain</span>
          <ul>
            <li style={docsToDisplay === "ChainHead" ? styles.active : styles.inactive} onClick={() => setDocs("ChainHead")}>ChainHead</li>
            <li style={docsToDisplay === "ChainGetBlock" ? styles.active : styles.inactive} onClick={() => setDocs("ChainGetBlock")}>ChainGetBlock</li>
            <li style={docsToDisplay === "ChainGetMessage" ? styles.active : styles.inactive} onClick={() => setDocs("ChainGetMessage")}>ChainGetMessage</li>
          </ul>
        </li>
        <li>
          <span style={styles.sectionHeader}>Client</span>
          <ul>
            <li style={docsToDisplay === "ClientImport" ? styles.active : styles.inactive} onClick={() => setDocs("ClientImport")}>ClientImport</li>
            <li style={docsToDisplay === "ClientHasLocal" ? styles.active : styles.inactive} onClick={() => setDocs("ClientHasLocal")}>ClientHasLocal</li>
            <li style={docsToDisplay === "ClientListImports" ? styles.active : styles.inactive} onClick={() => setDocs("ClientListImports")}>ClientListImports</li>
            <li style={docsToDisplay === "ClientQueryAsk" ? styles.active : styles.inactive} onClick={() => setDocs("ClientQueryAsk")}>ClientQueryAsk</li>
            <li style={docsToDisplay === "ClientDealSize" ? styles.active : styles.inactive} onClick={() => setDocs("ClientDealSize")}>ClientDealSize</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const styles = {
  active: {
    textDecoration: "underline"
  },
}

export default APISidebar;
