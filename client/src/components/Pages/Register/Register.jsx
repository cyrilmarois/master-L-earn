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
          role: "student",
        },
        {
          title: "DEVENIR FORMATEUR",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id aliquam erat, a vulputate justo. Suspendisse placerat scelerisque miut commodo.",
          logo: "fa-person-chalkboard",
          role: "teacher",
        },
        {
          title: "DEVENIR RECRUTEUR",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id aliquam erat, a vulputate justo. Suspendisse placerat scelerisque miut commodo.",
          logo: "fa-handshake",
          role: "recruiter",
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
                role={item.role}
              />
            ))
          : ""}
      </div>
    </section>
  );
};

export default Register;
