import React, { useEffect, useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import Plans from "./Plans/Plans";
import toast from "react-hot-toast";
import "./Staking.css";
import ErrorHelper from "../../Helpers/ErrorHelper";
import StakingRewardBtn from "./StakingReward/StakingRewardBtn";

const Staking = () => {
  const {
    state: { contractMLE, web3, accounts, contractMLEStaking },
  } = useEth();
  const [stakePlanOneAmount, setStakePlanOneAmount] = useState(0);
  const [stakePlanTwoAmount, setStakePlanTwoAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [depositStakingPlanOneTotal, setDepositStakingPlanOneTotal] = useState(0);
  const [depositStakingPlanTwoTotal, setDepositStakingPlanTwoTotal] = useState(0);

  const handleStakePlanOneInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setStakePlanOneAmount(e.target.value);
    }
  };

  const handleUnstakePlanOneInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setDepositStakingPlanOneTotal(e.target.value);
    }
  };

  const handleStakePlanTwoInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setStakePlanTwoAmount(e.target.value);
    }
  };

  const handleUnstakePlanTwoInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setDepositStakingPlanTwoTotal(e.target.value);
    }
  };

  const sendAllTokensPlanOne = () => {
    setStakePlanOneAmount(userBalance);
  };

  const sendAllTokensPlanTwo = () => {
    setStakePlanTwoAmount(userBalance);
  };

  const handleStakingPlanOne = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contractMLE.methods
          .stakeDeposit(convertAmount(stakePlanOneAmount), 0)
          .call({
            from: accounts[0],
          });
        await contractMLE.methods
          .stakeDeposit(convertAmount(stakePlanOneAmount), 0)
          .send({
            from: accounts[0],
          });

        resolve("Deposit created");
        getBalance();
      } catch (e) {
        console.error(e);
        const error = ErrorHelper.parseError(e);
        reject(error);
      }
    });

    toast.promise(myPromise, {
      loading: "Staking en cours...",
      success: <b>Dépot réalisé avec succès.</b>,
      error: (err) => `Erreur durant le staking : ${err.toString()}`,
    });
  };

  const convertAmount = (amount) => {
    return web3.utils.toWei(amount);
  };

  const handleStakingPlanTwo = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contractMLE.methods
          .stakeDeposit(convertAmount(stakePlanTwoAmount), 1)
          .call({
            from: accounts[0],
          });
        await contractMLE.methods
          .stakeDeposit(convertAmount(stakePlanTwoAmount), 1)
          .send({
            from: accounts[0],
          });

        resolve("Deposit created");
        getBalance();
      } catch (e) {
        console.error(e);
        const error = ErrorHelper.parseError(e);
        reject(error);
      }
    });

    toast.promise(myPromise, {
      loading: "Staking en cours...",
      success: <b>Dépot réalisé avec succès.</b>,
      error: (err) => `Erreur durant le staking : ${err.toString()}`,
    });
  };

  const handleUnstakePlanOne = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contractMLE.methods
          .stakeWithdraw(
            convertAmount(depositStakingPlanOneTotal.toString()),
            0
          )
          .call({
            from: accounts[0],
          });
        await contractMLE.methods
          .stakeWithdraw(
            convertAmount(depositStakingPlanOneTotal.toString()),
            0
          )
          .send({
            from: accounts[0],
          });
        resolve("Withdrawal created");
        getBalance();
      } catch (e) {
        console.error(e);
        const error = ErrorHelper.parseError(e);
        reject(error);
      }
    });

    toast.promise(myPromise, {
      loading: "Unstaking en cours...",
      success: <b>Retrait réalisé avec succès.</b>,
      error: (err) => `Erreur durant le retrait : ${err.toString()}`,
    });
  };

  const handleUnstakePlanTwo = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contractMLE.methods
          .stakeWithdraw(
            convertAmount(depositStakingPlanTwoTotal.toString()),
            1
          )
          .call({
            from: accounts[0],
          });
        await contractMLE.methods
          .stakeWithdraw(
            convertAmount(depositStakingPlanTwoTotal.toString()),
            1
          )
          .send({
            from: accounts[0],
          });
        resolve("Withdrawal created");
        getBalance();
      } catch (e) {
        console.error(e);
        const error = ErrorHelper.parseError(e);
        reject(error);
      }
    });

    toast.promise(myPromise, {
      loading: "Unstaking en cours...",
      success: <b>Retrait réalisé avec succès.</b>,
      error: (err) => `Erreur durant le retrait : ${err.toString()}`,
    });
  };

  useEffect(() => {
    if (contractMLE && contractMLEStaking && accounts) {
      // Withdrawal
      const getPastWithdrawalEvents = async () => {
        reCalculDepositStakingBalanceTotal();
      };
      getPastWithdrawalEvents();

      // get current total deposit amount
      const getCurrentDeposit = async () => {
        await contractMLEStaking.events
          .StakeDeposit({
            fromBlock: "earliest",
          })
          .on("data", (event) => {
            reCalculDepositStakingBalanceTotal();
          })
          .on("changed", (changed) => console.log(changed))
          .on("error", (err) => console.log(err))
          .on("connected", (str) => console.log(str));
      };
      getCurrentDeposit();

      // get current total withdraw amount
      const getCurrentWithdrawal = async () => {
        await contractMLEStaking.events
          .StakeWithdrawal({
            fromBlock: "earliest",
          })
          .on("data", (event) => {
            reCalculDepositStakingBalanceTotal();
          })
          .on("changed", (changed) => console.log(changed))
          .on("error", (err) => console.log(err))
          .on("connected", (str) => console.log(str));
      };
      getCurrentWithdrawal();
    }
  }, [contractMLE, contractMLEStaking, accounts]);

  const reCalculDepositStakingBalanceTotal = async () => {
    const usertotalStakedValuePlan0 = await contractMLEStaking.methods.getUsertotalStakedValue(accounts[0], 0)
      .call({from: accounts[0]});
    const usertotalStakedValuePlan1 = await contractMLEStaking.methods.getUsertotalStakedValue(accounts[0], 1)
      .call({from: accounts[0]});
    setDepositStakingPlanOneTotal(usertotalStakedValuePlan0 / 1e18);
    setDepositStakingPlanTwoTotal(usertotalStakedValuePlan1 / 1e18);
  };

  const getBalance = async () => {
    try {
      const tmpBalance = await contractMLE.methods
        .balanceOf(accounts[0])
        .call({ from: accounts[0] });
      console.log({ tmpBalance });
      setUserBalance(web3.utils.fromWei(tmpBalance, "ether"));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (contractMLE && accounts) {
      getBalance();
    }
  }, [contractMLE, accounts]);

  return (
    <div id="staking">
      <Plans />
      <hr />
      <h1 className="text-center p-3">Stakez vos MLE</h1>
      <section className="container d-flex justify-content-evenly text-center p-5">
        <div className="bloc col-3 staking-1 p-3">
          <h3>Plan 1</h3>
          <div className="mb-3">
            <label htmlFor="userTokenAmount" className="form-label">
              Token :{" "}
              <span className="walletAmount" onClick={sendAllTokensPlanOne}>
                {userBalance}
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
              value={stakePlanOneAmount}
              onChange={handleStakePlanOneInputChange}
              required
            />
            <span className="input-group-text">MLE</span>
          </div>
          <div className="mb-3">
            <button
              id="staking-button"
              type="submit"
              onClick={handleStakingPlanOne}
              required
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span> STAKE
            </button>
          </div>

          {depositStakingPlanOneTotal !== 0 ? (
            <>
              <div className="mb-3 input-group">
                <input
                  type="number"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="MLE"
                  value={depositStakingPlanOneTotal}
                  onChange={handleUnstakePlanOneInputChange}
                  required
                />
                <span className="input-group-text">MLE</span>
              </div>
              <div className="mb-3">
                <button
                  id="staking-button"
                  type="submit"
                  onClick={handleUnstakePlanOne}
                  required
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span> UNSTAKE
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="bloc col-3 staking-1 p-3">
          <h3>Plan 2</h3>
          <div className="mb-3">
            <label htmlFor="userTokenAmount" className="form-label">
              Token :{" "}
              <span className="walletAmount" onClick={sendAllTokensPlanTwo}>
                {userBalance}
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
              value={stakePlanTwoAmount}
              onChange={handleStakePlanTwoInputChange}
            />
            <span className="input-group-text">MLE</span>
          </div>
          <div className="mb-3">
            <button
              id="staking-button"
              type="submit"
              onClick={handleStakingPlanTwo}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span> STAKE
            </button>
          </div>
          {depositStakingPlanTwoTotal !== 0 ? (
            <>
              <div className="mb-3 input-group">
                <input
                  type="number"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="MLE"
                  value={depositStakingPlanTwoTotal}
                  onChange={handleUnstakePlanTwoInputChange}
                />
                <span className="input-group-text">MLE</span>
              </div>
              <div className="mb-3">
                <button
                  id="staking-button"
                  type="submit"
                  onClick={handleUnstakePlanTwo}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span> UNSTAKE
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </section>
      <StakingRewardBtn />
    </div>
  );
};

export default Staking;
