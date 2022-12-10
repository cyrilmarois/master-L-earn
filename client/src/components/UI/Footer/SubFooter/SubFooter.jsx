import "./SubFooter.css";
import logo from "../../../../images/mle-logo-xxs.png";

const SubFooter = () => {
  return (
    <div className="subFooter">
      <div className="container">
        <div className="row pt-5">
          <div className="col-10">
            <div className="row">
              <div className="col-12">
                <img src={logo} className="me-3" />
                &copy; 2022 Master & LEarn, Inc. Tous droits réservés.
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                Déclaration de confidentialité Conditions d’utilisation
                Utilisation des cookies Confiance Accessibilité Préférences en
                matière de cookies
              </div>
            </div>
          </div>
          <div className="col-2">
            <select className="form-select" aria-label="Default select example">
              <option defaultValue>Francais</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubFooter;
