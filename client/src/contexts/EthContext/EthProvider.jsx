import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (artifactMLE, artifactMLEStaking) => {
    if (artifactMLE && artifactMLEStaking) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      // TODO: change connexion process, do not call it directly
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abiMLE } = artifactMLE;
      const { abiMLEStaking } = artifactMLEStaking;
      let addressMLE, contractMLE;
      let addressMLEStaking, contractMLEStaking;
      try {
        addressMLE = artifactMLE.networks[networkID].address;
        contractMLE = new web3.eth.Contract(abiMLE, addressMLE);
        addressMLEStaking = await contractMLE.methods.mleStaking().call();
        contractMLEStaking = new web3.eth.Contract(abiMLEStaking, addressMLEStaking);
      } catch (err) {
        console.error(err);
      }
      dispatch({
        type: actions.init,
        data: { artifactMLE, artifactMLEStaking, web3, accounts, networkID, contractMLE, contractMLEStaking },
      });
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifactMLE = require("../../contracts/MLE.json");
        const artifactMLEStaking = require("../../contracts/MLEStaking.json");
        init(artifactMLE, artifactMLEStaking);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged", "disconnect"];
    const handleChange = () => {
      init(state.artifactMLE);
    };

    events.forEach((e) => {
      window.ethereum.on(e, handleChange);
    });
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifactMLE]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged", "disconnect"];
    const handleChange = () => {
      init(state.artifactMLEStaking);
    };

    events.forEach((e) => {
      window.ethereum.on(e, handleChange);
    });
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifactMLEStaking]);
  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
