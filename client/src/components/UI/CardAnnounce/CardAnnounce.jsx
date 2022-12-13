import "./CardAnnounce.css";
import React, { useEffect, useState } from "react";
import { useEth } from "../../../contexts/EthContext";
import toast from "react-hot-toast";
import ErrorHelper from "../../Helpers/ErrorHelper";

const CardAnnounce = (props) => {
  const {
    state: { accounts, contractMLE },
  } = useEth();
  const [tags, setTags] = useState("");

  const handleApplyAnnounce = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contractMLE.methods
          .applyAnnounce(props.recruiterAddress, props.announceId)
          .call({
            from: accounts[0],
          });
        await contractMLE.methods
          .applyAnnounce(props.recruiterAddress, props.announceId)
          .send({
            from: accounts[0],
          });
        resolve("Apply to formation success");
      } catch (e) {
        console.error(e);
        const error = ErrorHelper.parseError(e);
        reject(error);
      }
    });

    toast.promise(myPromise, {
      loading: "Depot de candidature en cours...",
      success: <b>Candidature soumise avec succès.</b>,
      error: (err) => `Erreur lors du depot de candidature : ${err.toString()}`,
    });
  };

  useEffect(() => {
    if (props.tags && props.tags.length !== 0) {
      setTags(props.tags.join(", "));
    }
  }, [accounts, contractMLE]);

  return (
    <div id="card-announce" className="p-3">
      <div className="d-flex justify-content-between flex-grow-1">
        <div className="title">{props.title}</div>
        {!props.action ? (
          <div className="apply">
            <span onClick={handleApplyAnnounce}>
              <i className="fa-regular fa-handshake"></i>
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="m-2 flex-grow-1">{props.description}</div>
      <p className="m-2 author">Publiée le : {props.creationDate}</p>
      <p className="m-2 tags">{tags}</p>
    </div>
  );
};

export default CardAnnounce;
