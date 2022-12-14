import logo from "../../../images/mle-logov2-sm.png";
import SubHeader from "./SubHeader/SubHeader";
import React, { useEffect } from "react";
import { useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import "./Header.css";
import { Toaster } from "react-hot-toast";

const Header = () => {
  const [loggedAddress, setLoggedAddress] = useState("Connexion");

  const {
    state: { contractMLE, accounts },
  } = useEth();

  const handleConnexion = async () => {
    if (accounts && accounts[0]) {
      const addressConnexion = transformAddress(accounts[0]);
      setLoggedAddress(addressConnexion);
    }
  };

  // LATER multiple wallet managment
  // useEffect(() => {
  //   const checkWallets = () => {
  //     const tmpWallets = JSON.parse(localStorage.getItem("wallets"));
  //     if (tmpWallets === null) {
  //       let wallets = { metamask: false };
  //       if (typeof window.ethereum !== "undefined") {
  //         console.log("MetaMask is installed!");
  //         wallets.metamask = true;
  //       }
  //       console.log({ wallets });
  //       localStorage.setItem("wallets", JSON.stringify(wallets));
  //     }
  //   };
  //   checkWallets();
  // }, []);

  const transformAddress = (account) => {
    return account.slice(0, 5) + "..." + account.slice(-4);
  };

  useEffect(() => {
    if (accounts && accounts[0]) {
      const addressConnexion = transformAddress(accounts[0]);
      setLoggedAddress(addressConnexion);
    }
  }, [contractMLE, accounts]);

  return (
    <>
      <div>
        <Toaster />
      </div>
      <header>
        <div className="container">
          <div id="header" className="row align-items-center">
            <div className="col-1">
              <div id="logo">
                <img src={logo} alt="logo" />
              </div>
            </div>
            <div className="col-11 align-items-center">
              <div className="row">
                <div className="col-12">
                  <form className="row" role="search">
                    <div className="col-6 ms-3">
                      <input
                        className="form-control"
                        type="search"
                        placeholder="Rechercher"
                        aria-label="Search"
                      />
                    </div>

                    <div className="col-1 offset-4">
                      <button
                        id="connect"
                        onClick={handleConnexion}
                        type="button"
                        className="btn btn-metamask"
                      >
                        {loggedAddress}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="col-12">
                  <SubHeader />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
