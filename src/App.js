import { useContext, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Main from "./components/Main";
import "./App.css";
import { Provider, Context } from "./reducer/store";

const App = () => {
  const { state, setLotusVersion, setMissingDependencies } = useContext(Context);
  console.log(state);
  useEffect(() => {
    window.ipcRenderer.on("electron-state", (event, message) => {
      const { lotusVersion, updateAvailable, missingDependencies } = JSON.parse(message);
      setLotusVersion(lotusVersion, updateAvailable);
      setMissingDependencies(missingDependencies);
    });
  });
  return (
      <BrowserRouter>
        <div className="main">
          <Route exact path="/" component={Main} />
        </div>
      </BrowserRouter>
  );
};

export default () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};
