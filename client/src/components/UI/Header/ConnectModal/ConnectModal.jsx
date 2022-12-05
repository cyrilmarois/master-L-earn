import "./ConnectModal.css";

import WalletButton from "../../WalletButton/WalletButton";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import useEth from "../../../../contexts/EthContext/useEth";

Modal.setAppElement(document.getElementById("root"));

const ConnectModal = ({ modalIsOpen }) => {
  const [wallets, setWallets] = useState({});
  const {
    state: { web3 },
  } = useEth();
  //   const [modalIsOpen, setIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "500px",
      height: "300px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      boxShadow: "0px 0px 10px #d9d8d8",
    },
  };

  useEffect(() => {
    const parseWallets = () => {
      const tmpWallets = JSON.parse(localStorage.getItem("wallets"));
      if (tmpWallets !== null) {
        console.log({ wallets, tmpWallets });
        setWallets(tmpWallets);
      }
      //   Object.keys(tmpWallets).forEach(function (key, index, value) {
      //     console.log({ key, index, value });
      //     // tmpWallets[key] = {name: key.charAt(0).toUppsercase(), value: ;
      //   });

      console.log({ wallets, tmpWallets });
    };
    parseWallets();
    console.log({ wallets });
  }, []);

  //   useEffect(() => {
  //     async function fetchData() {
  //       // You can await here
  //       const response = await MyAPI.getData(someId);
  //       // ...
  //     }
  //     fetchData();
  //   }, [someId]); // Or [] if effect doesn't need props or state
  //   function openModal() {
  //     setIsOpen(true);
  //     const walletsFromLS = localStorage.getItem("wallets");
  //     console.log({ walletsFromLS: walletsFromLS });
  //   }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    // setIsOpen(false);
  }

  const handleMetamaskConnexion = (e) => {
    //Will Start the metamask extension
    console.log({ web3 });
    web3.eth.requestAccounts();
    console.log("Jarvis");
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      //   style={customStyles}
      className="connect-modal"
      overlayClassName="connect-overlay"
      contentLabel="Connect wallet modal"
    >
      {/* {wallets.map((value, key) => { */}
      <div className="row d-flex justify-content-center mb-2">
        <div className="d-grid gap-2 col-6 mx-auto">
          <button
            id="metamask"
            onClick={handleMetamaskConnexion}
            type="button"
            className={`btn btn-metamask`}
          >
            METAMASK
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConnectModal;
