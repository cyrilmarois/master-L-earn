import React, { useEffect, useState } from "react";
import useEth from "../../../../contexts/EthContext/useEth";
import Plan from "./Plan/Plan";

const Plans = () => {
  const {
    state: { contractMLE, web3, accounts },
  } = useEth();
  const [stakingPlans, setStakingPlans] = useState([]);

  // GET STAKING PLANS
  useEffect(() => {
    if (contractMLE) {
      const getPlans = async () => {
        try {
          const stakingPlanOne = await contractMLE.methods.stakingPlans(0).call({
            from: accounts[0],
          });
          const stakingPlanTwo = await contractMLE.methods.stakingPlans(1).call({
            from: accounts[0],
          });
          setStakingPlans([stakingPlanOne, stakingPlanTwo]);
        } catch (e) {
          console.error(e);
        }
      };
      getPlans();
    }
  }, [contractMLE, accounts]);

  return (
    <>
      <h1 className="text-center p-3">Programme de staking du MLE</h1>

      <section className="container d-flex justify-content-evenly text-center py-5">
        {stakingPlans.length > 0
          ? stakingPlans.map((item, i) => (
              <Plan
                key={i}
                title={item.title}
                apr={item.apr}
                // lockPeriod={moment.unix(item.lockPeriod).month()}
                lockPeriod={i === 0 ? 12 : 24}
                minAmount={web3.utils.fromWei(item.minTokenAmount, "ether")}
                maxAmount={web3.utils.fromWei(item.maxTokenDeposit, "ether")}
                tokenDeposit={web3.utils.fromWei(
                  item.totalStakingDeposit,
                  "ether"
                )}
                totalStaker={item.totalStakers}
              />
            ))
          : ""}
      </section>
    </>
  );
};

export default Plans;
