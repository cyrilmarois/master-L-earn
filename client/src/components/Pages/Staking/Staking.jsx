import { useEffect, useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import Plan from "./Plan/Plan";
import "./Staking.css";

const Staking = () => {
  const {
    state: { contract, accounts },
  } = useEth();
  const [amount, setAmount] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);

  const stakingPlans = [
    {
      title: "Plan 1",
      lockPeriod: 6,
      apr: 10,
      minAmount: 1000,
      maxAmount: 1000000,
      tokenDeposit: 10000,
      stakerTotal: 654,
    },
    {
      title: "Plan 2",
      lockPeriod: 12,
      apr: 17,
      minAmount: 500,
      maxAmount: 2500000,
      tokenDeposit: 1090000,
      stakerTotal: 3561,
    },
    {
      title: "Plan 3",
      lockPeriod: 24,
      apr: 25,
      minAmount: 500,
      maxAmount: 5000000,
      tokenDeposit: 2678900,
      stakerTotal: 11309,
    },
  ];

  const handleStakeInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setStakeAmount(e.target.value);
    }
  };

  const sendAllTokens = () => {
    console.log({ amount });
    setStakeAmount(amount);
  };

  const handleStaking = async () => {
    try {
      await contract.methods.stake().call({
        from: accounts[0],
      });
      await contract.methods.stake().send({
        from: accounts[0],
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("JARVIS");
    setAmount(1500);
    console.log({ amount });
  }, [contract, accounts]);

  return (
    <div id="staking">
      <h1 className="text-center p-3">Programme de staking du MLE</h1>

      <section className="container d-flex justify-content-evenly text-center py-5">
        <Plan
          title={stakingPlans[0].title}
          lockPeriod={stakingPlans[0].lockPeriod}
          apr={stakingPlans[0].apr}
          minAmount={stakingPlans[0].minAmount}
          maxAmount={stakingPlans[0].maxAmount}
          tokenDeposit={stakingPlans[0].tokenDeposit}
          stakerTotal={stakingPlans[0].stakerTotal}
        />

        <Plan
          title={stakingPlans[1].title}
          lockPeriod={stakingPlans[1].lockPeriod}
          apr={stakingPlans[1].apr}
          minAmount={stakingPlans[1].minAmount}
          maxAmount={stakingPlans[1].maxAmount}
          tokenDeposit={stakingPlans[1].tokenDeposit}
          stakerTotal={stakingPlans[1].stakerTotal}
        />

        <Plan
          title={stakingPlans[2].title}
          lockPeriod={stakingPlans[2].lockPeriod}
          apr={stakingPlans[2].apr}
          minAmount={stakingPlans[2].minAmount}
          maxAmount={stakingPlans[2].maxAmount}
          tokenDeposit={stakingPlans[2].tokenDeposit}
          stakerTotal={stakingPlans[2].stakerTotal}
        />
      </section>
      <hr />
      <section className="container d-flex justify-content-evenly text-center py-5">
        <div className="bloc col-3 staking-1 p-3">
          <h3>Plan 1</h3>
          <div className="mb-3">
            <label htmlFor="userTokenAmount" className="form-label">
              Token :{" "}
              <span className="walletAmount" onClick={sendAllTokens}>
                {amount}
              </span>
            </label>
          </div>
          <label htmlFor="userTokenStakeAmount" className="form-label">
            Montant a staker
          </label>

          <div className="mb-3 input-group">
            <input
              type="number"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="MLE"
              value={stakeAmount}
              onChange={handleStakeInputChange}
            />
            <span className="input-group-text">MLE</span>
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary mb-3"
              onClick={handleStaking}
            >
              STAKE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Staking;
