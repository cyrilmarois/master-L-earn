import "./Formations.css";
import React, { useState } from "react";
import { useEffect } from "react";
import CardFormation from "../../../UI/CardFormation/CardFormation";
import { useEth } from "../../../../contexts/EthContext";

const Formations = () => {
  const {
    state: { contractMLE, accounts },
  } = useEth();
  const [formations, setFormations] = useState([]);
  const [newFormation, setNewFormation] = useState({});

  useEffect(() => {
    if (contractMLE && accounts) {
      const getFormations = async () => {
        try {
          const MLEFormations = await contractMLE.methods
            .getFormationForTeacher(accounts[0])
            .call({
              from: accounts[0],
            });
          if (MLEFormations.length > 0) {
            setFormations(MLEFormations);
          }
        } catch (e) {
          console.error(e);
        }
      };
      getFormations();
    }
  }, [accounts, contractMLE]);

  // GET CURRENT FORMATION
  useEffect(() => {
    if ((contractMLE, accounts)) {
      const getCurrentFormationPost = async () => {
        await contractMLE.events
          .FormationPublished({
            fromBlock: "earliest",
          })
          .on("data", (event) => {
            console.log({ event });
            setNewFormation(event.returnValues);
          })
          .on("changed", (changed) => console.log(changed))
          .on("error", (err) => console.log(err))
          .on("connected", (str) => console.log(str));
      };
      getCurrentFormationPost();
    }
  }, [contractMLE, accounts]);

  return (
    <section id="Formation" className="container">
      <div className="pt-5 mb-5">
        <a
          href="/teacher/formation/add"
          role="button"
          className="btn btn-primary"
        >
          Créer une formation
        </a>
      </div>
      <h2>Vos formations existantes</h2>
      <div className="d-flex flex-wrap pt-3 pb-5">
        {newFormation.length > 0 ? (
          <CardFormation
            key={666}
            title={newFormation.title}
            duration={newFormation.duration}
            rating={newFormation.rating}
            teacherFullName={newFormation.teacherFullName}
            creationDate={newFormation.creationDate}
            price={newFormation.price}
            tags={newFormation.tags}
            basket="false"
          />
        ) : (
          ""
        )}
        {formations.length > 0
          ? formations.map((item, i) => (
              <CardFormation
                key={i}
                title={item.title}
                duration={item.duration}
                rating={item.rating}
                teacherFullName={item.teacherFullName}
                creationDate={item.creationDate}
                price={item.price}
                tags={item.tags}
                basket="false"
              />
            ))
          : ""}
      </div>
    </section>
  );
};

export default Formations;
