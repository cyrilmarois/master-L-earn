import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import Header from "./components/UI/Header/Header";
import Main from "./components/UI/Main/Main";
import Footer from "./components/UI/Footer/Footer";
import React from "react";

const App = () => {
  return (
    <EthProvider>
      <div id="App">
        <div className="container-fluid">
          <Header />
          <Main />
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
};

export default App;
