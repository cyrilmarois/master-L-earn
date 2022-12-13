import "./Filters.css";
import React from "react";

const Filters = () => {
  return (
    <div id="Filters">
      <div className="container">
        <div className="row pt-3 ps-3 pe-3">
          <div className="col-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            non scelerisque augue. Maecenas a dui nisi. Nullam vel dolor nulla.
            Suspendisse pharetra placerat est, et semper nunc ornare ornare.
            Pellentesque cursus dolor cursus aliquet gravida.
          </div>
          <div className="row pt-3 ps-3 pe-3">
            <div className="col-4">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Tri
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue>Plus recent</option>
                <option value="1">Disponibilite</option>
              </select>
            </div>
            <div className="col-4">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Niveau
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue>Selectionnez...</option>
                <option value="1">Tous</option>
                <option value="2">Junior</option>
                <option value="3">Confirmé</option>
                <option value="4">Sénior</option>
              </select>
            </div>
            <div className="col-4">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Domaine
              </label>
              <select
                multiple
                className="form-control"
                id="exampleFormControlSelect2"
              >
                <option defaultValue>Selectionnez...</option>
                <option value="1">Blockchain</option>
                <option value="2">UI/UX</option>
                <option value="3">Solidity</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
