import "./Announces.css";
import React, { useState } from "react";
import { useEffect } from "react";
import { useEth } from "../../../../contexts/EthContext";
import CardAnnounce from "../../../UI/CardAnnounce/CardAnnounce";

const Announces = () => {
  const {
    state: { contractMLE, accounts },
  } = useEth();
  const [announces, setAnnounces] = useState([]);
  const [newFormation, setNewFormation] = useState({});

  useEffect(() => {
    // if (contractMLE && accounts) {
    //   const getFormations = async () => {
    //     try {
    //       const MLEFormations = await contractMLE.methods
    //         .getFormationForStudent(accounts[0])
    //         .call({
    //           from: accounts[0],
    //         });
    //       console.log({ MLEFormations });
    //       // if (MLEFormations.length > 0) {
    //       //   setFormations(MLEFormations);
    //       // }
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   };
    //   getFormations();
    // }
  }, [accounts, contractMLE]);

  // GET CURRENT FORMATION
  useEffect(() => {
    // if ((contractMLE, accounts)) {
    //   const getCurrentFormationPost = async () => {
    //     await contractMLE.events
    //       .FormationPublished({
    //         fromBlock: "earliest",
    //       })
    //       .on("data", (event) => {
    //         console.log({ event });
    //         setNewFormation(event.returnValues);
    //       })
    //       .on("changed", (changed) => console.log(changed))
    //       .on("error", (err) => console.log(err))
    //       .on("connected", (str) => console.log(str));
    //   };
    //   getCurrentFormationPost();
    // }
  }, [contractMLE, accounts]);

  return (
    <section id="Formation" className="container">
      <div className="pt-5 mb-5">
        <a
          href="/recruiter/1/announces/add"
          role="button"
          className="btn btn-primary"
        >
          Créer une annonce
        </a>
      </div>
      <h2>Vos annonces existantes</h2>
      <div className="d-flex flex-wrap pt-3 pb-5">
        {/* {newFormation.length > 0 ? (
          <CardAnnounce
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
        )} */}

        {/* {formations.length > 0
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
          : ""} */}
        <CardAnnounce
          key="666"
          announceId="666"
          title="Search Solidity developer senior"
          recruiterAddress="0x5666eD746E98FA440ceD3714d5915c2556888a5c"
          creationDate="16708547791"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ipsum nec lacus mattis efficitur. Nam facilisis leo sem, vitae tristique est sollicitudin eu. Integer nec varius lectus, eget lacinia magna."
          tags={["blockchain", "solidity"]}
          // action="true"
        />
      </div>
    </section>
  );
};

export default Announces;
