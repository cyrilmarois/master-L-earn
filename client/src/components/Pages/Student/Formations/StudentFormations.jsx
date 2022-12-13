import "./StudentFormations.css";
import React, { useState } from "react";
import { useEffect } from "react";
import CardFormation from "../../../UI/CardFormation/CardFormation";
import { useEth } from "../../../../contexts/EthContext";

const StudentFormations = () => {
  const {
    state: { contractMLE, accounts },
  } = useEth();
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    if (contractMLE && accounts) {
      const getFormations = async () => {
        try {
          const studentFormationInfos = await contractMLE.methods
            .getFormationForStudent(accounts[0])
            .call({
              from: accounts[0],
            });

          if (studentFormationInfos.length > 0) {
            let studentFormations = [];
            for (let i = 0; i < studentFormationInfos.length; i++) {
              const studentFormationId = parseInt(
                studentFormationInfos[i].formationId
              );
              const teacherAddress = studentFormationInfos[i].teacherAddress;
              const teacherFormations = await contractMLE.methods
                .getFormationForTeacher(teacherAddress)
                .call({
                  from: accounts[0],
                });
              if (teacherFormations.length > 0) {
                let tmpStudentFormations = [];
                for (let j = 0; j < teacherFormations.length; j++) {
                  if (j === studentFormationId) {
                    tmpStudentFormations.push(teacherFormations[j]);
                  }
                }

                const cards = buildCardFormations(
                  teacherAddress,
                  tmpStudentFormations
                );

                if (cards.length > 0) {
                  studentFormations.push(cards);
                }
              }

              setFormations(studentFormations);
            }
          }
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
          basket="false"
        />
      );
    });

    return cards;
  };

  return (
    <section id="Student-formations" className="container">
      <h2>Vos formations achetees</h2>
      <div className="d-flex flex-wrap pt-3 pb-5">
        {formations.length > 0 ? formations : ""}
      </div>
    </section>
  );
};

export default StudentFormations;
