import React, { useEffect, useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import moment from "moment";
import Plans from "./Plans/Plans";
import toast from "react-hot-toast";
import "./Staking.css";

const Staking = () => {
  const {
    state: { contract, web3, accounts },
  } = useEth();
  const [stakePlanOneAmount, setStakePlanOneAmount] = useState(0);
  const [stakePlanTwoAmount, setStakePlanTwoAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [depositStakingPlanOneTotal, setDepositStakingPlanOneTotal] = useState(
    0
  );
  const [depositStakingPlanTwoTotal, setDepositStakingPlanTwoTotal] = useState(
    0
  );

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
        await contract.methods
          .stakeDeposit(convertAmount(stakePlanOneAmount), 0)
          .call({
            from: accounts[0],
          });
        await contract.methods
          .stakeDeposit(convertAmount(stakePlanOneAmount), 0)
          .send({
            from: accounts[0],
          });

        resolve("Deposit created");
        getBalance();
      } catch (e) {
        console.error(e);
        reject("Error during deposit");
      }
    });

    toast.promise(myPromise, {
      loading: "Staking en cours...",
      success: <b>Dépot réalisé avec succès.</b>,
      error: <b>Erreur durant le staking.</b>,
    });
  };

  const convertAmount = (amount) => {
    return web3.utils.toWei(amount);
  };

  const handleStakingPlanTwo = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contract.methods
          .stakeDeposit(convertAmount(stakePlanTwoAmount), 1)
          .call({
            from: accounts[0],
          });
        await contract.methods
          .stakeDeposit(convertAmount(stakePlanTwoAmount), 1)
          .send({
            from: accounts[0],
          });

        resolve("Deposit created");
        getBalance();
      } catch (e) {
        console.error(e);
        reject("Error during deposit");
      }
    });

    toast.promise(myPromise, {
      loading: "Staking en cours...",
      success: <b>Dépot réalisé avec succès.</b>,
      error: <b>Erreur durant le staking.</b>,
    });
  };

  const handleUnstakePlanOne = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contract.methods
          .stakeTithdraw(convertAmount(depositStakingPlanOneTotal), 0)
          .call({
            from: accounts[0],
          });
        await contract.methods
          .stakeTithdraw(convertAmount(depositStakingPlanOneTotal), 0)
          .send({
            from: accounts[0],
          });

        resolve("Withdrawal created");
        getBalance();
      } catch (e) {
        console.error(e);
        reject("Error during withdrawal");
      }
    });

    toast.promise(myPromise, {
      loading: "Unstaking en cours...",
      success: <b>Retrait réalisé avec succès.</b>,
      error: <b>Erreur durant le retrait.</b>,
    });
  };

  const handleUnstakePlanTwo = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contract.methods
          .stakeTithdraw(convertAmount(stakePlanOneAmount), 0)
          .call({
            from: accounts[0],
          });
        await contract.methods
          .stakeTithdraw(convertAmount(stakePlanOneAmount), 0)
          .send({
            from: accounts[0],
          });
        resolve("Withdrawal created");
        getBalance();
      } catch (e) {
        console.error(e);
        reject("Error during withdrawal");
      }
    });

    toast.promise(myPromise, {
      loading: "Unstaking en cours...",
      success: <b>Retrait réalisé avec succès.</b>,
      error: <b>Erreur durant le retrait.</b>,
    });
  };

  useEffect(() => {
    if ((contract, accounts)) {
      // calcul total thought old deposits
      const getPastEvents = async () => {
        let oldDepositEvents = await contract.getPastEvents("StakeDeposit", {
          fromBlock: 0,
          toBlock: "latest",
        });

        let deposits = [];
        deposits[0] = 0;
        deposits[1] = 0;
        oldDepositEvents.forEach((event) => {
          if (event.returnValues.from === accounts[0]) {
            const planId = parseInt(event.returnValues.planId);
            const amount = parseInt(
              web3.utils.fromWei(event.returnValues.amount, "ether")
            );
            deposits[planId] += amount;
          }

          setDepositStakingPlanOneTotal(deposits[0]);
          setDepositStakingPlanTwoTotal(deposits[1]);
        });
      };

      getPastEvents();

      // get current total deposit amount
      const getRecentDeposit = async () => {
        await contract.events
          .StakeDeposit({
            fromBlock: "earliest",
          })
          .on("data", (event) => {
            let newEventDeposit = event.returnValues.totalDeposit;
            const planId = parseInt(event.returnValues.planId);
            const amount = web3.utils.fromWei(newEventDeposit, "ether");
            if (planId === 0) {
              setDepositStakingPlanOneTotal(amount);
            } else if (planId === 1) {
              setDepositStakingPlanTwoTotal(amount);
            }
          })
          .on("changed", (changed) => console.log(changed))
          .on("error", (err) => console.log(err))
          .on("connected", (str) => console.log(str));
      };
      getRecentDeposit();
    }
  }, [contract, accounts]);

  const getBalance = async () => {
    try {
      const tmpBalance = await contract.methods
        .balanceOf(accounts[0])
        .call({ from: accounts[0] });

      setUserBalance(web3.utils.fromWei(tmpBalance, "ether"));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (contract && accounts) {
      getBalance();
    }
  }, [contract, accounts]);

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
            />
            <span className="input-group-text">MLE</span>
          </div>
          <div className="mb-3">
            <button
              id="staking-button"
              type="submit"
              onClick={handleStakingPlanOne}
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
                />
                <span className="input-group-text">MLE</span>
              </div>
              <div className="mb-3">
                <button
                  id="staking-button"
                  type="submit"
                  onClick={handleUnstakePlanOne}
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
          {depositStakingPlanOneTotal !== 0 ? (
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
    </div>
  );
};

export default Staking;
