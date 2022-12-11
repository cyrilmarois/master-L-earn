import "./Formation.css";
import Filters from "./Filters/Filters";
import React, { useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import { useEffect } from "react";
import CardFormation from "./CardFormation/CardFormation";

const Formation = () => {
  const {
    state: { web3, contract, accounts },
  } = useEth();
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    if (contract && accounts) {
      const getFormations = async () => {
        try {
          console.log({ methods: contract.methods });
          const tmpFormations = await contract.methods.getFormations().call({
            from: accounts[0],
          });
          console.log({ tmpFormations });
          setFormations(tmpFormations);
        } catch (e) {
          console.error(e);
        }
      };
      getFormations();
    }
  }, [accounts, contract]);

  // get all formations
  useEffect(() => {
    if ((contract, accounts)) {
      // calcul total thought old deposits
      const getPastEvents = async () => {
        let oldFormationEvents = await contract.getPastEvents(
          "FormationPublished",
          {
            fromBlock: 0,
            toBlock: "latest",
          }
        );

        let formations = [];
        oldFormationEvents.forEach((event) => {
          const planId = parseInt(event.returnValues.planId);
          const amount = parseInt(
            web3.utils.fromWei(event.returnValues.amount, "ether")
          );
          formations[planId] += amount;
        });
      };

      getPastEvents();

      // get current total deposit amount
      // const getRecentDeposit = async () => {
      //   await contract.events
      //     .StakeDeposit({
      //       fromBlock: "earliest",
      //     })
      //     .on("data", (event) => {
      //       let newEventDeposit = event.returnValues.totalDeposit;
      //       const planId = parseInt(event.returnValues.planId);
      //       const amount = web3.utils.fromWei(newEventDeposit, "ether");
      //       if (planId === 0) {
      //         setDepositStakingPlanOneTotal(amount);
      //       } else if (planId === 1) {
      //         setDepositStakingPlanTwoTotal(amount);
      //       }
      //     })
      //     .on("changed", (changed) => console.log(changed))
      //     .on("error", (err) => console.log(err))
      //     .on("connected", (str) => console.log(str));
      // };
      // getRecentDeposit();
    }
  }, [contract, accounts]);

  return (
    <>
      <Filters />

      <section id="Formation" className="container">
        <div className="d-flex flex-wrap pt-3 pb-5">
          {formations.length > 0
            ? formations.map((item, i) => (
                <CardFormation
                  key={i}
                  title={item.title}
                  duration={item.duration}
                  rating={item.rating}
                  teacherFullName={item.teacherFullName}
                  creationDate={item.creationDate}
                  price={web3.utils.fromWei(item.price, "ether")}
                  tags={item.tags}
                />
              ))
            : ""}
        </div>
      </section>
    </>
  );
};

export default Formation;
