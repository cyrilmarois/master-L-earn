import "./Formation.css";
import Card from "../../UI/Card/Card";
import Filters from "./Filters/Filters";

const Formation = () => {
  const fakeFormations = [
    {
      title: "Learn Solidity",
      duration: 4500,
      rating: 4,
      teacherFullName: "Mathilde Passy",
      creationDate: "2022-01-01 21:43:22",
      price: 1500,
    },
    {
      title: "Learn Consulting",
      duration: 1800,
      rating: 4.5,
      teacherFullName: "Christophe Pepin",
      creationDate: "2022-05-07 18:55:32",
      price: 3800,
    },
    {
      title: "Learn Defi",
      duration: 10800,
      rating: 5,
      teacherFullName: "Dimitry Axel",
      creationDate: "2022-02-22 10:09:16",
      price: 7600,
    },
    {
      title: "Learn algorithm",
      duration: 7200,
      rating: 4,
      teacherFullName: "Maxence Guillemain d'Echon",
      creationDate: "2022-11-18 11:01:54",
      price: 2300,
    },
    {
      title: "Learn Metamask",
      duration: 2000,
      rating: 1,
      teacherFullName: "Cyril Marois",
      creationDate: "2022-06-08 12:33:44",
      price: 666,
    },
  ];
  return (
    <>
      <Filters />

      <section id="Formation" className="container">
        <div className="d-flex flex-wrap pt-3 pb-5">
          <Card
            title={fakeFormations[0].title}
            duration={fakeFormations[0].duration}
            rating={fakeFormations[0].rating}
            teacherFullName={fakeFormations[0].teacherFullName}
            creationDate={fakeFormations[0].creationDate}
            price={fakeFormations[0].price}
          />
          <Card
            title={fakeFormations[1].title}
            duration={fakeFormations[1].duration}
            rating={fakeFormations[1].rating}
            teacherFullName={fakeFormations[1].teacherFullName}
            creationDate={fakeFormations[1].creationDate}
            price={fakeFormations[1].price}
          />
          <Card
            title={fakeFormations[2].title}
            duration={fakeFormations[2].duration}
            rating={fakeFormations[2].rating}
            teacherFullName={fakeFormations[2].teacherFullName}
            creationDate={fakeFormations[2].creationDate}
            price={fakeFormations[2].price}
          />
          <Card
            title={fakeFormations[3].title}
            duration={fakeFormations[3].duration}
            rating={fakeFormations[3].rating}
            teacherFullName={fakeFormations[3].teacherFullName}
            creationDate={fakeFormations[3].creationDate}
            price={fakeFormations[3].price}
          />
          <Card
            title={fakeFormations[4].title}
            duration={fakeFormations[4].duration}
            rating={fakeFormations[4].rating}
            teacherFullName={fakeFormations[4].teacherFullName}
            creationDate={fakeFormations[4].creationDate}
            price={fakeFormations[4].price}
          />
        </div>
      </section>
    </>
  );
};

export default Formation;
