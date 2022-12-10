import { useEffect, useState } from "react";
import useEth from "../../../../contexts/EthContext/useEth";
import moment from "moment";
import "./AddFormation.css";
import React from "react";

const AddFormation = () => {
  const [formationTitle, setFormationTitle] = useState("");
  const [formationModuleCount, setFormationModuleCount] = useState("");
  const [formationDurationHour, setFormationDurationHour] = useState("");
  const [formationDurationMinute, setFormationDurationMinute] = useState("");
  const [formationDurationSecond, setFormationDurationSecond] = useState("");
  const [formationPrice, setFormationPrice] = useState("");
  // const [formationDescription, setFormationDescription] = useState("");
  // const [formationResource, setFormationResource] = useState("");
  const [formationTag, setFormationTag] = useState([]);
  const [hours, setHours] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [seconds, setSeconds] = useState([]);
  const {
    state: { contract, accounts, web3 },
  } = useEth();

  const handleFormationTitleChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setFormationTitle(e.target.value);
    // }
  };

  const handleFormationModuleCountChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setFormationModuleCount(e.target.value);
    // }
  };

  const handleFormationDurationHourChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setFormationDurationHour(e.target.value);
    // }
  };

  const handleFormationDurationMinuteChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setFormationDurationMinute(e.target.value);
    // }
  };

  const handleFormationDurationSecondChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setFormationDurationSecond(e.target.value);
    // }
  };

  const handleFormationPriceChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setFormationPrice(e.target.value);
    // }
  };

  // const handleFormationDescriptionChange = (e) => {
  //   // if (/^\w.+$|^$/.test(e.target.value)) {
  //   setFormationDescription(e.target.value);
  //   // }
  // };

  // const handleFormationResourceChange = (e) => {
  //   // if (/^\w.+$|^$/.test(e.target.value)) {
  //   setFormationResource(e.target.value);
  //   // }
  // };

  const handleFormationTagChange = (e) => {
    // if (/^\w.+$|^$/.test(e.target.value)) {
    setFormationTag(e.target.value);
    // }
  };

  const postFormation = async () => {
    try {
      const formationDuration = convertFormDuration();
      const newFormationPrice = web3.utils.toWei(formationPrice);
      const newFormationTag = formationTag.replace(", ", ",").split(",");

      await contract.methods
        .postFormation(
          formationModuleCount,
          formationDuration,
          newFormationPrice,
          formationTitle,
          // formationDescription,
          // formationResource,
          newFormationTag
        )
        .call({ from: accounts[0] });
      await contract.methods
        .postFormation(
          formationModuleCount,
          formationDuration,
          newFormationPrice,
          formationTitle,
          // formationDescription,
          // formationResource,
          newFormationTag
        )
        .send({ from: accounts[0] });
    } catch (e) {
      console.error(e);
    }
  };

  const convertFormDuration = () => {
    return moment(
      formationDurationHour +
        ":" +
        formationDurationMinute +
        ":" +
        formationDurationSecond,
      "HH:mm:ss"
    ).diff(moment().startOf("day"), "seconds");
  };

  const getMinutesSecondsOptions = () => {
    let tmpTimers = [];
    for (let i = 1; i < 60; i++) {
      let time = i;
      if (i < 10) {
        time = "0" + i;
      }
      tmpTimers.push(
        <option key={i} value={time}>
          {time}
        </option>
      );
    }
    setMinutes(tmpTimers);
    setSeconds(tmpTimers);
  };

  const getHoursOptions = () => {
    let tmpTimers = [];
    for (let i = 1; i < 25; i++) {
      let time = i;
      if (i < 10) {
        time = "0" + i;
      }
      tmpTimers.push(
        <option key={i} value={time}>
          {time}
        </option>
      );
    }
    setHours(tmpTimers);
  };

  useEffect(() => {
    getHoursOptions();
    getMinutesSecondsOptions();
  }, [contract]);

  return (
    <div id="post-formation">
      <div className="container">
        <div className="row py-5">
          <div className="col-6 offset-3">
            <form id="create-formation" className="mb-3 g-3 row">
              <div className="mb-3 row">
                <label htmlFor="formationTitle" className="form-label">
                  Titre de la formation
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formationTitle"
                  placeholder="Ma super formation..."
                  value={formationTitle}
                  onChange={handleFormationTitleChange}
                  required
                />
              </div>
              {/* <div className="mb-3 row">
                <label htmlFor="formationDescription" className="form-label">
                  Description
                </label>
                <textarea
                  type="number"
                  className="form-control"
                  id="formationDescription"
                  placeholder="Description..."
                  value={formationDescription}
                  onChange={handleFormationDescriptionChange}
                  required
                />
              </div> */}
              <div className="mb-3 row">
                <div className="col-6 ps-0">
                  <label htmlFor="formationModuleCount" className="form-label">
                    Nombre de modules
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="formationModuleCount"
                    value={formationModuleCount}
                    onChange={handleFormationModuleCountChange}
                    required
                  />
                </div>
                <div className="col-6 pe-0">
                  <label htmlFor="formationDuration" className="form-label">
                    Duree
                  </label>
                  <div className="row">
                    <div className="col-4">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={handleFormationDurationHourChange}
                        required
                      >
                        <option key="0" defaultValue="00">
                          00
                        </option>
                        {hours}
                      </select>
                    </div>
                    <div className="col-4">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={handleFormationDurationMinuteChange}
                        required
                      >
                        <option key="0" defaultValue="00">
                          00
                        </option>
                        {minutes}
                      </select>
                    </div>
                    <div className="col-4">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={handleFormationDurationSecondChange}
                        required
                      >
                        <option key="0" defaultValue="00">
                          00
                        </option>
                        {seconds}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3 row">
                <label
                  htmlFor="formationPrice"
                  className="col-sm-2 col-form-label"
                >
                  Prix
                </label>
                <div className="mb-3 ps-0 pe-0 input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="formationPrice"
                    value={formationPrice}
                    onChange={handleFormationPriceChange}
                    required
                  />
                  <span className="input-group-text">MLE</span>
                </div>
              </div>

              {/* <div className="mb-3 row">
                <label htmlFor="formationResource" className="form-label">
                  Ressources externes
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formationResource"
                  placeholder="http://"
                  value={formationResource}
                  onChange={handleFormationResourceChange}
                />
              </div> */}
              <div className="mb-3 row">
                <label htmlFor="formationTag" className="form-label">
                  Tags
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formationTag"
                  placeholder="blockchain, web3, ..."
                  value={formationTag}
                  onChange={handleFormationTagChange}
                />
              </div>
              <div className="mb-3">
                <button
                  id="create-formation"
                  type="button"
                  className="btn btn-primary"
                  onClick={postFormation}
                >
                  Creer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFormation;
