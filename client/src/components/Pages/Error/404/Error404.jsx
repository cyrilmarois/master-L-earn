import React from "react";
import { useRouteError } from "react-router-dom";
import { EthProvider } from "../../../../contexts/EthContext";
import Footer from "../../../UI/Footer/Footer";
import Header from "../../../UI/Header/Header";
import "./error.css";
import errorPicture from "../../../../images/error-404.jpg";
const Error404 = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <EthProvider>
      <div id="App">
        <div className="container-fluid">
          <Header />
          <main>
            <div className="container text-center" id="error-404">
              <img
                src={errorPicture}
                alt="error 404"
                style={{ maxWidth: "808px" }}
              />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
};

export default Error404;
