import logo from "../../../images/mle-logo-sm.png";
import SubHeader from "./SubHeader/SubHeader";
import React, { useEffect } from "react";
import { useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import "./Header.css";

const Header = () => {
  const [loggedAddress, setLoggedAddress] = useState("Connexion");
  const [hasError, setHasError] = useState(false);

  const {
    state: { web3, contract },
  } = useEth();

  const handleConnexion = async () => {
    await web3.eth
      .requestAccounts()
      .then((account) => {
        console.log({ account });
        if (account && account[0]) {
          localStorage.setItem("connexion", JSON.stringify(account[0]));
          const address = transformAddress(account[0]);
          setLoggedAddress(address);
        }
      })
      .catch(() => {
        setHasError(true);
      });
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
    const account = JSON.parse(localStorage.getItem("connexion"));

    if (account) {
      const address = transformAddress(account);
      setLoggedAddress(address);
    }
  }, [contract]);

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
                      className={`btn btn-metamask ${hasError ? `error` : ``}`}
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
  );
};

export default Header;
