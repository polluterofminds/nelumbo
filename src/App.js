import { useContext, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Main from "./components/Main";
import "./App.css";
import { Provider, Context } from "./reducer/store";

const App = () => {
  const { setLotusVersion, setMissingDependencies, setUpdateText, setStatus } = useContext(Context);

  useEffect(() => {
    window.ipcRenderer.on("electron-state", (event, message) => {
      const { lotusVersion, updateAvailable, missingDependencies } = JSON.parse(message);
      console.log(missingDependencies);
      setLotusVersion(lotusVersion, updateAvailable);
      setMissingDependencies(missingDependencies);
    });
    window.ipcRenderer.on("launch-updates", (event, message) => {
      setUpdateText(message);    
    })
  });

  useEffect(() => {
    window.ipcRenderer.send('Check lotus');
    window.ipcRenderer.on('Lotus state', (event, message) => {
      console.log(message)
      setStatus(message)
    });
    window.ipcRenderer.send('Get state');
    // eslint-disable-next-line
  }, []);
  return (
      <BrowserRouter>
        <div className="main">
          <Route exact path="/" component={Main} />
        </div>
      </BrowserRouter>
  );
};

const app = () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
}

export default app;