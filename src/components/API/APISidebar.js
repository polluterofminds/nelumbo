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
