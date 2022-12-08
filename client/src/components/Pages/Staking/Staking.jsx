import { useEffect, useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import Plan from "./Plan/Plan";
import "./Staking.css";

const Staking = () => {
  const {
    state: { contract, web3 },
  } = useEth();
  const [amount, setAmount] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [plans, setPlans] = useState([]);
  const [totalStakers, setTotalStakers] = useState([]);
  const [totalStakingDeposit, setTotalStakingDeposit] = useState([]);
  const [account, setAccount] = useState();

  const stakingPlans = [
    {
      title: "Plan 1",
      lockPeriod: 12,
      apr: 10,
      minAmount: 500,
      maxAmount: 2500000,
      tokenDeposit: 1090000,
      stakerTotal: 3561,
    },
    {
      title: "Plan 2",
      lockPeriod: 24,
      apr: 20,
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
      console.log({ account });
      await contract.methods.stakeDeposit(stakeAmount, 0).call({
        from: account,
      });
      await contract.methods.stakeDeposit(stakeAmount, 0).send({
        from: account,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setAmount(1500);
    setAccount(JSON.parse(localStorage.getItem("connexion")));
    console.log("STAKING", {
      contract,
      web3,
      account,
      amount,
    });
    if (contract && account) {
      console.log("STAKING", {
        methods: contract.methods,
      });
      const getPlans = async () => {
        try {
          const tmpPlans = await contract.methods.stakingPlans.call({
            from: account,
          });
          setPlans(tmpPlans);
        } catch (e) {
          console.error(e);
        }
      };
      getPlans();

      const getTotalStakers = async () => {
        try {
          const tmpTotalStakers = await contract.methods.totalStakers.call({
            from: account,
          });
          setTotalStakers(tmpTotalStakers);
        } catch (e) {
          console.error(e);
        }
      };
      getTotalStakers();

      const getTotalStakingDeposit = async () => {
        try {
          const tmpTotalStakingDeposit =
            await contract.methods.totalStakingDeposit.call({
              from: account,
            });
          setTotalStakingDeposit(tmpTotalStakingDeposit);
        } catch (e) {
          console.error(e);
        }
      };
      getTotalStakingDeposit();
    }
    console.log({ amount });
  }, [contract]);

  return (
    <div id="staking">
      <h1 className="text-center p-3">Programme de staking du MLE</h1>

      <section className="container d-flex justify-content-evenly text-center py-5">
        {/* <Plan
          title={plans[0].title}
          lockPeriod={plans[0].lockPeriod}
          apr={plans[0].apr}
          minAmount={plans[0].minTokenAmount}
          maxAmount={plans[0].maxTokenAmount}
          tokenDeposit={totalStakingDeposit[0]}
          totalStaker={totalStakers[0]}
        /> */}
        <Plan
          title={stakingPlans[0].title}
          lockPeriod={stakingPlans[0].lockPeriod}
          apr={stakingPlans[0].apr}
          minAmount={stakingPlans[0].minAmount}
          maxAmount={stakingPlans[0].maxAmount}
          tokenDeposit={stakingPlans[0].tokenDeposit}
          totalStaker={stakingPlans[0].stakerTotal}
        />

        <Plan
          title={stakingPlans[1].title}
          lockPeriod={stakingPlans[1].lockPeriod}
          apr={stakingPlans[1].apr}
          minAmount={stakingPlans[1].minAmount}
          maxAmount={stakingPlans[1].maxAmount}
          tokenDeposit={stakingPlans[1].tokenDeposit}
          totalStaker={stakingPlans[1].stakerTotal}
        />

        {/* <Plan
          title={stakingPlans[2].title}
          lockPeriod={stakingPlans[2].lockPeriod}
          apr={stakingPlans[2].apr}
          minAmount={stakingPlans[2].minAmount}
          maxAmount={stakingPlans[2].maxAmount}
          tokenDeposit={stakingPlans[2].tokenDeposit}
          stakerTotal={stakingPlans[2].stakerTotal}
        /> */}
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
            <button id="staking-button" type="submit" onClick={handleStaking}>
              <span></span>
              <span></span>
              <span></span>
              <span></span> STAKE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Staking;
