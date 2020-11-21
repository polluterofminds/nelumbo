import { BrowserRouter, Route } from "react-router-dom";
import Main from "./components/Main";
import "./App.css";
import { Provider } from "./reducer/store";

const App = () => {
  return (
    <Provider>
      <BrowserRouter>
        <div className="main">
          <Route exact path="/" component={Main} />
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
