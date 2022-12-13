import "./Formations.css";
import Filters from "./Filters/Filters";
import React, { useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import { useEffect } from "react";
import CardFormation from "../../UI/CardFormation/CardFormation";

const Formations = () => {
  const {
    state: { contractMLE, accounts },
  } = useEth();
  const [formations, setFormations] = useState([]);

  // GET ALL FORMATIONS
  useEffect(() => {
    if (contractMLE && accounts) {
      const getFormations = async () => {
        try {
          const teachersAddresses = await contractMLE.methods
            .getTeachersAddresses()
            .call({
              from: accounts[0],
            });

          let teachersFormations = [];
          for (let i = 0; i < teachersAddresses.length; i++) {
            const teacherAddress = teachersAddresses[i];
            const teacherFormations = await contractMLE.methods
              .getFormationForTeacher(teacherAddress)
              .call({
                from: accounts[0],
              });

            const cards = buildCardFormations(
              teacherAddress,
              teacherFormations
            );
            if (cards.length > 0) {
              teachersFormations.push(cards);
            }
          }
          setFormations(teachersFormations);
        } catch (e) {
          console.error(e);
        }
      };
      getFormations();
    }
  }, [accounts, contractMLE]);

  const buildCardFormations = (teacherAddress, teacherFormations) => {
    let cards = [];
    teacherFormations.map((item, i) => {
      cards.push(
        <CardFormation
          key={i}
          formationId={i}
          title={item.title}
          duration={item.duration}
          rating={item.rating}
          teacherAddress={teacherAddress}
          creationDate={item.creationDate}
          price={item.price}
          tags={item.tags}
        />
      );
    });

    return cards;
  };

  return (
    <>
      <Filters />

      <section id="Formations" className="container">
        <div className="d-flex flex-wrap pb-5">
          {formations.length > 0 ? formations : ""}
        </div>
      </section>
    </>
  );
};

export default Formations;
