import logo from "../../../images/mle-logo-sm.png";
import SubHeader from "./SubHeader/SubHeader";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <div className="container">
        <div id="header" className="row align-items-center">
          <div className="col-1">
            <div id="logo">
              <img src={logo} />
            </div>
          </div>
          <div className="col-11 align-items-center">
            <div className="row">
              <div className="col-12">
                <form className="row me-3" role="search">
                  <div class="col-6 w-50 ">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Rechercher..."
                      aria-label="Search"
                    />
                  </div>

                  <div className="col-1 offset-5">
                    <button type="button" className="btn btn-primary">
                      Connexion
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-12">
                <SubHeader />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
