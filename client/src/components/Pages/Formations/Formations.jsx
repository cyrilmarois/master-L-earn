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

          let MLEFormations = [];

          for (let i = 0; i < teachersAddresses.length; i++) {
            const teacherAddress = teachersAddresses[i];
            const tmpFormationTeachers = await contractMLE.methods
              .getFormationForTeacher(teacherAddress)
              .call({
                from: accounts[0],
              });
            console.log({ tmpFormationTeachers });

            const obj = {};
            obj[teacherAddress] = tmpFormationTeachers;
            MLEFormations.push(obj);
          }
          setFormations(MLEFormations);
          console.log({ MLEFormations });
        } catch (e) {
          console.error(e);
        }
      };
      getFormations();
    }
  }, [accounts, contractMLE]);

  const buildCardFormation = (items) => {
    // console.log({ items });
    const address = Object.keys(items);
    const itum = items[address];

    let cards = [];
    itum.map((item, i) => {
      cards.push(
        <CardFormation
          key={i}
          formationId={i}
          title={item.title}
          duration={item.duration}
          rating={item.rating}
          teacherAddress={address[0]}
          creationDate={item.creationDate}
          price={item.price}
          tags={item.tags}
        />
      );
    });

    return cards;
  };

  // GET FORMATIONS THOUGHT PAST EVENTS
  // useEffect(() => {
  //   if (contractMLE && accounts) {
  //     const getPastEvents = async () => {
  //       let oldFormationEvents = await contractMLE.getPastEvents(
  //         "FormationPublished",
  //         {
  //           fromBlock: 0,
  //           toBlock: "latest",
  //         }
  //       );

  //       let tmpFormations = [];
  //       console.log({ oldFormationEvents });
  //       oldFormationEvents.forEach((event) => {
  //         console.log({ eventValues: event.returnValues });
  //         tmpFormations.push(event.returnValues);
  //       });
  //       console.log({ tmpFormations });
  //       setFormations(tmpFormations);
  //     };

  //     getPastEvents();
  //   }
  // }, [contractMLE, accounts]);

  const fakeFormations = [
    {
      title: "Learn Solidity",
      duration: 3600000,
      rating: 4,
      creationDate: "2022-11-01",
      price: "2500000000000000000000",
      tags: ["blockchain", "solidity"],
    },

    {
      title: "Learn Metamask",
      duration: 300,
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
            ? formations.map((items) => {
                return buildCardFormation(items);
              })
            : ""}
        </div>
      </section>
    </>
  );
};

export default Formations;
