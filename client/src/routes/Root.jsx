import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/UI/Footer/Footer";
import Header from "../components/UI/Header/Header";
import Main from "../components/UI/Main/Main";
import { EthProvider } from "../contexts/EthContext";

const Root = () => {
  return (
    <EthProvider>
      <div id="App">
        <div className="container-fluid">
          <Header />
          <Main>
            <Outlet />
          </Main>
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
};

export default Root;
