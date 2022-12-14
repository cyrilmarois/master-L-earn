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
    let _asStudent = false;
    let _asTeacher = false;
    let _asRecruiter = false;
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contractMLE.methods
          .registerUser(accounts[0], true, false, false)
          .call({ from: accounts[0] });

        await contractMLE.methods
          .registerUser(accounts[0], true, false, false)
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

  return (
    <div className="card-profile justify-content-center align-items-center pt-3">
      <div className="title mb-3">
        <i className={`fa-solid ${props.logo}`}></i>
      </div>
      <p>{props.description}</p>
      <a href="#" className="btn btn-primary" onClick={handleRegistration}>
        {props.title}
      </a>
    </div>
  );
};

export default CardRegister;
