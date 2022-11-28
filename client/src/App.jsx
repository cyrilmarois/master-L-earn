import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import "./App.css";

import Header from "./components/UI/Header/Header";
import SubHeader from "./components/UI/Header/SubHeader/SubHeader";
import Main from "./components/UI/Header/Main/Main";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container-fluid">
          <Header />
          <Main />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
