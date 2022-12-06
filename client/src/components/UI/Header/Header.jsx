import logo from "../../../images/mle-logo-sm.png";
import SubHeader from "./SubHeader/SubHeader";
import WalletButton from "../WalletButton/WalletButton";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";

import "./Header.css";
import { useState } from "react";
import ConnectModal from "./ConnectModal/ConnectModal";
import useEth from "../../../contexts/EthContext/useEth";

const Header = () => {
  // const [modalIsOpen, setIsOpen] = useState(false);
  const [loggedAddress, setLoggedAddress] = useState("Connexion");
  const [accounts, setAccounts] = useState();
  const {
    state: { web3, contract },
  } = useEth();

  // let wallets = { metamask: false };

  // function openModal() {
  //   setIsOpen(true);
  // }
  const handleConnexion = async (e) => {
    console.debug({ web3 });
    // console.debug({ web3, web3Eth: web3.eth, windowEth: window.ethereum });
    // const tmpAccounts = await web3.eth.requestAccounts();
    // setAccounts(tmpAccounts);
    // console.debug({ accounts, tmpAccounts });
  };

  useEffect(() => {
    const checkWallets = () => {
      const tmpWallets = JSON.parse(localStorage.getItem("wallets"));
      if (tmpWallets === null) {
        let wallets = { metamask: false };
        if (typeof window.ethereum !== "undefined") {
          console.log("MetaMask is installed!");
          wallets.metamask = true;
        }
        console.log({ wallets });
        localStorage.setItem("wallets", JSON.stringify(wallets));
      }
    };
    checkWallets();
  }, []);

  useEffect(() => {
    if (contract && accounts && accounts[0]) {
      setLoggedAddress(accounts[0].slice(0, 5) + "..." + accounts[0].slice(-4));
    }
  }, [accounts, contract]);

  return (
    <header>
      <div className="container">
        <div id="header" className="row align-items-center">
          <div className="col-1">
            <div id="logo">
              <img src={logo} />
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
                    {/* <ConnectModal modalIsOpen={modalIsOpen} /> */}
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
  );
};

export default Header;
