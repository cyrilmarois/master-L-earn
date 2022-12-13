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

  useEffect(() => {
    if (contractMLE && accounts) {
      const getAnnounces = async () => {
        try {
          const studentAnnounces = await contractMLE.methods
            .getJobsForStudent(accounts[0])
            .call({
              from: accounts[0],
            });

          console.log({ studentAnnounces });
          if (studentAnnounces.length > 0) {
            setAnnounces(studentAnnounces);
          }
        } catch (e) {
          console.error(e);
        }
      };
      getAnnounces();
    }
  }, [accounts, contractMLE]);

  const buildCardAnnounces = (recruiterAddress, recruiterAnnounces) => {
    let cards = [];
    recruiterAnnounces.map((item, i) => {
      cards.push(
        <CardAnnounce
          key={i}
          announceId={i}
          title={item.title}
          recruiterAddress={recruiterAddress}
          creationDate={item.creationDate}
          description={item.description}
          tags={item.tags}
        />
      );
    });

    return cards;
  };

  return (
    <section id="Formation" className="container">
      <h2>Vos annonces candidatees</h2>
      <div className="d-flex flex-wrap pt-3 pb-5">
        <CardAnnounce
          key="666"
          announceId="666"
          title="Search Solidity developer senior"
          recruiterAddress="0x5666eD746E98FA440ceD3714d5915c2556888a5c"
          creationDate="16708547791"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ipsum nec lacus mattis efficitur. Nam facilisis leo sem, vitae tristique est sollicitudin eu. Integer nec varius lectus, eget lacinia magna."
          tags={["blockchain", "solidity"]}
          action="false"
        />
      </div>
    </section>
  );
};

export default Announces;
