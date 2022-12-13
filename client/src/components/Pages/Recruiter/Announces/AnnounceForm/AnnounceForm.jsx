import { useState } from "react";
import useEth from "../../../../../contexts/EthContext/useEth";
import toast from "react-hot-toast";
import "./AnnounceForm.css";
import React from "react";
import ErrorHelper from "../../../../Helpers/ErrorHelper";

const AnnounceForm = () => {
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceDescription, setAnnounceDescription] = useState("");
  const [announceTag, setAnnounceTag] = useState([]);

  const {
    state: { contractMLE, accounts },
  } = useEth();

  const handleAnnounceTitleChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setAnnounceTitle(e.target.value);
    // }
  };

  const handleAnnounceDescriptionChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setAnnounceDescription(e.target.value);
    // }
  };

  const handleAnnounceTagChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setAnnounceTag(e.target.value);
    // }
  };

  const createAnnounce = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        const newAnnounceTag =
          announceTag.length > 0
            ? announceTag.replace(", ", ",").split(",")
            : [];
        console.log({ announceTitle, announceDescription, newAnnounceTag });
        await contractMLE.methods
          .postAnnounce(announceTitle, announceDescription, newAnnounceTag)
          .call({ from: accounts[0] });

        await contractMLE.methods
          .postAnnounce(announceTitle, announceDescription, newAnnounceTag)
          .send({ from: accounts[0] });

        resolve("Announce created");
      } catch (e) {
        console.error(e);
        const error = ErrorHelper.parseError(e);
        reject(error);
      }
    });

    toast.promise(myPromise, {
      loading: "Sauvegarde en cours...",
      success: <b>Annonce créée avec succès.</b>,
      error: (err) => `Erreur durant la création : ${err.toString()}`,
    });
  };

  return (
    <div id="post-announce">
      <div className="container">
        <div className="row py-5">
          <div className="col-6 offset-3">
            <form id="create-announce" className="mb-3 g-3 row">
              <div className="mb-3 row">
                <label htmlFor="announceTitle" className="form-label">
                  Titre de l'annonce
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="announceTitle"
                  placeholder="Ma superbe annonce..."
                  value={announceTitle}
                  onChange={handleAnnounceTitleChange}
                  required
                />
              </div>
              <div className="mb-3 row">
                <label htmlFor="announceDescription" className="form-label">
                  Description
                </label>
                <textarea
                  type="number"
                  className="form-control"
                  id="announceDescription"
                  placeholder="Description..."
                  value={announceDescription}
                  onChange={handleAnnounceDescriptionChange}
                  required
                />
              </div>
              <div className="mb-3 row">
                <label htmlFor="announceTag" className="form-label">
                  Tags
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="announceTag"
                  placeholder="blockchain, web3, ..."
                  value={announceTag}
                  onChange={handleAnnounceTagChange}
                />
              </div>
              <div className="mb-3 d-flex justify-content-between">
                <button
                  id="create-announce"
                  type="reset"
                  className="btn btn-warning"
                >
                  Annuler
                </button>
                <button
                  id="create-announce"
                  type="button"
                  className="btn btn-primary"
                  onClick={createAnnounce}
                >
                  Créer mon annonce
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnounceForm;
