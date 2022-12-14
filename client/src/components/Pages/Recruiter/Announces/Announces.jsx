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
  const [newAnnounce, setNewAnnounce] = useState({});

  useEffect(() => {
    if (contractMLE && accounts) {
      const getAnnounces = async () => {
        try {
          const MLEAnnounces = await contractMLE.methods
            .getAnnounceForRecruiter(accounts[0])
            .call({
              from: accounts[0],
            });

          if (MLEAnnounces.length > 0) {
            setAnnounces(MLEAnnounces);
          }
        } catch (e) {
          console.error(e);
        }
      };
      getAnnounces();
    }
  }, [accounts, contractMLE]);

  // GET CURRENT ANNOUNCE
  useEffect(() => {
    if ((contractMLE, accounts)) {
      const getCurrentAnnouncePost = async () => {
        await contractMLE.events
          .AnnouncePublished({
            fromBlock: "earliest",
          })
          .on("data", (event) => {
            console.log({ event });
            setNewAnnounce(event.returnValues);
          })
          .on("changed", (changed) => console.log(changed))
          .on("error", (err) => console.log(err))
          .on("connected", (str) => console.log(str));
      };
      getCurrentAnnouncePost();
    }
  }, [contractMLE, accounts]);

  return (
    <section id="Formation" className="container">
      <div className="pt-5 mb-5">
        <a
          href="/recruiter/announce/add"
          role="button"
          className="btn btn-primary"
        >
          Créer une annonce
        </a>
      </div>
      <h2>Vos annonces existantes</h2>
      <div className="d-flex flex-wrap pt-3 pb-5">
        {newAnnounce.length > 0 ? (
          <CardAnnounce
            key={666}
            title={newAnnounce.title}
            duration={newAnnounce.duration}
            rating={newAnnounce.rating}
            teacherFullName={newAnnounce.teacherFullName}
            creationDate={newAnnounce.creationDate}
            price={newAnnounce.price}
            tags={newAnnounce.tags}
            action="false"
          />
        ) : (
          ""
        )}

        {announces.length > 0
          ? announces.map((item, i) => (
              <CardAnnounce
                key={i}
                announceId={i}
                title={item.title}
                recruiterAddress={item.recruiterAddress}
                creationDate={item.creationDate}
                description={item.description}
                tags={item.tags}
                action="false"
              />
            ))
          : ""}
      </div>
    </section>
  );
};

export default Announces;
