import useEth from "../../../../contexts/EthContext/useEth";
import React, { useEffect } from "react";

function StakingRewardBtn() {
  const { state: { contractMLE, accounts } } = useEth();

  const start = async () => {
    const ownr = await contractMLE.methods.owner().call({from: accounts[0] });
    const ptd = await contractMLE.methods.profitToDistribute().call({ from: accounts[0] });
    console.log({profitToDistribute: ptd.toString()});
    if (ownr == accounts[0]) {
      await contractMLE.methods.distributeProfits().send({ from: accounts[0] });
      console.log("ProfitsDistributed");
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
