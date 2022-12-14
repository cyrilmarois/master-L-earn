import React from "react";
import { useEth } from "../../../contexts/EthContext";
import ErrorHelper from "../../Helpers/ErrorHelper";
import toast from "react-hot-toast";
import "./CardRegister.css";

const CardRegister = (props) => {
  const {
    state: { accounts, contractMLE },
  } = useEth();

  const handleRegistration = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        const roles = getRoles();
        await contractMLE.methods
          .register(roles.student, roles.teacher, roles.recruiter)
          .call({ from: accounts[0] });

        await contractMLE.methods
          .register(roles.student, roles.teacher, roles.recruiter)
          .send({ from: accounts[0] });
        resolve("Registration complete");
      } catch (e) {
        console.error(e);
        const error = ErrorHelper.formatError(e);
        reject(error);
      }
    });

    toast.promise(myPromise, {
      loading: "Création de profil en cours...",
      success: <b>Création de profil réussie</b>,
      error: (err) => `Erreur durant la creation : ${err.toString()}`,
    });
  };

  const getRoles = () => {
    let roles = {
      student: false,
      teacher: false,
      recruiter: false,
    };
    if (props.role === "student") {
      roles.student = true;
    } else if (props.role === "teacher") {
      roles.teacher = true;
    } else if (props.role === "recruiter") {
      roles.recruiter = true;
    }

    return roles;
  };

  return (
    <div className="card-profile justify-content-center align-items-center pt-5">
      <div className="title mb-3">
        <i className={`fa-solid ${props.logo}`}></i>
      </div>
      <p>{props.description}</p>
      <button className="btn btn-primary mt-4" onClick={handleRegistration}>
        {props.title}
      </button>
    </div>
  );
};

export default CardRegister;
