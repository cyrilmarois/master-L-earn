import "./Formations.css";
import Filters from "./Filters/Filters";
import React, { useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import { useEffect } from "react";
import CardFormation from "../../UI/CardFormation/CardFormation";

const Formations = () => {
  const {
    state: { contract, accounts },
  } = useEth();
  const [formations, setFormations] = useState([]);

  // GET ALL FORMATIONS
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

  // GET FORMATIONS THOUGHT PAST EVENTS
  useEffect(() => {
    if (contract && accounts) {
      const getPastEvents = async () => {
        let oldFormationEvents = await contract.getPastEvents(
          "FormationPublished",
          {
            fromBlock: 0,
            toBlock: "latest",
          }
        );

        let tmpFormations = [];
        console.log({ oldFormationEvents });
        oldFormationEvents.forEach((event) => {
          console.log({ eventValues: event.returnValues });
          tmpFormations.push(event.returnValues);
        });
        console.log({ tmpFormations });
        setFormations(tmpFormations);
      };

      getPastEvents();
    }
  }, [contract, accounts]);

  const fakeFormations = [
    {
      title: "Learn Solidity",
      duration: 7200,
      rating: 4,
      creationDate: "2022-11-01",
      price: "2500000000000000000000",
      tags: ["blockchain", "solidity"],
    },

    {
      title: "Learn Metamask",
      duration: 2000,
      rating: 3,
      creationDate: "2022-10-25",
      price: "666000000000000000000",
      tags: ["blockchain", "metamask"],
    },
    {
      title: "Learn Defi",
      duration: 10800,
      rating: 5,
      creationDate: "2022-09-18",
      price: "1230000000000000000000",
      tags: ["blockchain", "defi"],
    },
  ];

  return (
    <>
      <Filters />

      <section id="Formations" className="container">
        <div className="d-flex flex-wrap pb-5">
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
                />
              ))
            : ""}

          {fakeFormations.map((item, i) => (
            <CardFormation
              key={i}
              title={item.title}
              duration={item.duration}
              rating={item.rating}
              teacherFullName={item.teacherFullName}
              creationDate={item.creationDate}
              price={item.price}
              tags={item.tags}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Formations;
