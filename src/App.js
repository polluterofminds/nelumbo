import { useContext, useEffect } from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";
import Main from "./components/Main";
import "./App.css";
import { Provider, Context } from "./reducer/store";
const { ipcRenderer } = window.require("electron");

const App = () => {
  const {
    setLotusVersion,
    setMissingDependencies,
    setUpdateText,
    setStatus,
    state,
  } = useContext(Context);
  useEffect(() => {
    console.log("checking on dependencies");
    ipcRenderer.on("electron-state", (event, message) => {   
      console.log(typeof message);
      const parsedMessage = JSON.parse(message);         
      const { lotusVersion, updateAvailable, missingDependencies } = parsedMessage;
      setLotusVersion(lotusVersion, updateAvailable);
      setMissingDependencies(missingDependencies);
    });

    ipcRenderer.on("launch-updates", (event, message) => {
      setUpdateText(message);
    });
  });

  useEffect(() => {
    ipcRenderer.send("Check lotus");
    ipcRenderer.on("Lotus state", (event, message) => {
      setStatus(message);
    });
    ipcRenderer.send("Get state");
    // eslint-disable-next-line
  }, []);

  return (
    <HashRouter>
      <div className="main">
        <Route render={() => <Redirect to="/" />} />
        <Route exact path="/" component={Main} />
      </div>
    </HashRouter>
  );
};

const app = () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};

export default app;
