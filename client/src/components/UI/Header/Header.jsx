import logo from "../../../images/mle-logo-sm.png";
import SubHeader from "../SubHeader/SubHeader";
import "./Header.css";

const Header = () => {
  return (
    <header className="mb-3">
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
      {/* <div
        className="container-fluid d-grid gap-3 align-items-center"
        style={{ gridTemplateColumns: "1fr 2fr" }}
      >
        <div id="logo w-50">
          <img src={logo} />
        </div>

        <div className="d-flex align-items-center">
          <form className="w-75 me-3" role="search">
            <input
              className="form-control form-control-lg"
              type="search"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>

          <div className="flex-shrink-0 dropdown">
            <button type="button" className="btn btn-primary btn-lg">
              Connect
            </button>
          </div>
        </div>
      </div> */}
    </header>
  );
};

export default Header;
