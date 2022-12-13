import "./Announces.css";
import React, { useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import { useEffect } from "react";
import CardAnnounce from "../../UI/CardAnnounce/CardAnnounce";
import Filters from "./Filters/Filters";

const Announces = () => {
  const {
    state: { contractMLE, accounts },
  } = useEth();
  const [announces, setAnnounces] = useState([]);

  // GET ALL FORMATIONS
  useEffect(() => {
    if (contractMLE && accounts) {
      const getFormations = async () => {
        try {
          const recruitersAddresses = await contractMLE.methods
            .getRecruitersAddress()
            .call({
              from: accounts[0],
            });

          let recruitersAnnounces = [];
          for (let i = 0; i < recruitersAddresses.length; i++) {
            const recruiterAddress = recruitersAddresses[i];
            const recruiterAnnounces = await contractMLE.methods
              .getAnnounceForRecruiter(recruiterAddress)
              .call({
                from: accounts[0],
              });

            const cards = buildCardAnnounces(
              recruiterAddress,
              recruiterAnnounces
            );
            if (cards.length > 0) {
              recruitersAnnounces.push(cards);
            }
          }

          setAnnounces(recruitersAnnounces);
        } catch (e) {
          console.error(e);
        }
      };
      getFormations();
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
    <>
      <Filters />

      <section id="Announces" className="container">
        <div className="d-flex flex-wrap pb-5">
          {announces.length > 0 ? announces : ""}
        </div>
      </section>
    </>
  );
};

export default Announces;
