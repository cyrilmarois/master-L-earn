import useEth from "../../../../contexts/EthContext/useEth";
import React, { useEffect } from "react";

function StakingRewardBtn() {
  const { state: { contractMLE, accounts } } = useEth();

  const start = async () => {
    const ownr = await contractMLE.methods.owner().call({from: accounts[0] });
    if (ownr == accounts[0]) {
      await contractMLE.methods.distributeProfits().call({ from: accounts[0] });
    }
    else {
      alert("You are not the owner.");
      return;
    }
  };

  return (
    <div className="btns-container">
      <div className="btns">
        <button onClick={start}>
          Distribuer les Profits
        </button>
      </div>
    </div>
  );
}

export default StakingRewardBtn;
