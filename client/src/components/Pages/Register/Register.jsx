import "./Register.css";
import React, { useEffect, useState } from "react";
import CardRegister from "../../UI/CardRegister/CardRegister";

const Register = () => {
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    const initProfile = () => {
      setProfiles([
        {
          title: "DEVENIR APPRENANT",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id aliquam erat, a vulputate justo. Suspendisse placerat scelerisque miut commodo.",
          logo: "fa-graduation-cap",
        },
        {
          title: "DEVENIR FORMATEUR",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id aliquam erat, a vulputate justo. Suspendisse placerat scelerisque miut commodo.",
          logo: "fa-person-chalkboard",
        },
        {
          title: "DEVENIR RECRUTEUR",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id aliquam erat, a vulputate justo. Suspendisse placerat scelerisque miut commodo.",
          logo: "fa-handshake",
        },
      ]);
    };
    initProfile();
  }, []);

  return (
    <section id="register" className="container">
      <div className="d-flex justify-content-evenly text-center p-5">
        {profiles.length > 0
          ? profiles.map((item, i) => (
              <CardRegister
                key={i}
                title={item.title}
                description={item.description}
                logo={item.logo}
              />
            ))
          : ""}
        {/* <div className="card-profile justify-content-center align-items-center pt-3">
          <div className="title mb-3">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id
            aliquam erat, a vulputate justo. Suspendisse placerat scelerisque mi
            ut commodo.
          </p>
          <div className="align-items-end">
            <a href="#" className="btn btn-primary">
              DEVENIR APPRENANT
            </a>
          </div>
        </div>
        <div className="card-profile justify-content-center align-items-center pt-3">
          <div className="title mb-3">
            <i className="fa-solid fa-person-chalkboard"></i>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id
            aliquam erat, a vulputate justo. Suspendisse placerat scelerisque mi
            ut commodo.
          </p>
          <a href="#" className="btn btn-primary">
            DEVENIR FORMATEUR
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default Register;
