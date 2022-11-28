import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import "./App.css";

import Header from "./components/UI/Header/Header";
import SubHeader from "./components/UI/SubHeader/SubHeader";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container-fluid">
          <Header />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
