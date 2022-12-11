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
            <div className="col-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Tri
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue>Plus recent</option>
                <option value="1">Meilleur note</option>
                <option value="2">Prix croissant</option>
                <option value="3">Prix decroissant</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Niveau
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue>Selectionnez...</option>
                <option value="1">Debutant</option>
                <option value="2">Intermediaire</option>
                <option value="3">Confirme</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Produit
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue>Selectionnez...</option>
                <option value="1">Blockchain</option>
                <option value="2">Developpement</option>
                <option value="3">Cuisine</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Role
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue>Selectionnez...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
