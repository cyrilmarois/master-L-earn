import "./Filters.css";

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
              <label for="exampleFormControlInput1" class="form-label">
                Tri
              </label>
              <select class="form-select" aria-label="Default select example">
                <option selected>Plus recent</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="col-3">
              <label for="exampleFormControlInput1" class="form-label">
                Niveau
              </label>
              <select class="form-select" aria-label="Default select example">
                <option selected>Selectionnez...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="col-3">
              <label for="exampleFormControlInput1" class="form-label">
                Produit
              </label>
              <select class="form-select" aria-label="Default select example">
                <option selected>Selectionnez...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="col-3">
              <label for="exampleFormControlInput1" class="form-label">
                Role
              </label>
              <select class="form-select" aria-label="Default select example">
                <option selected>Selectionnez...</option>
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
