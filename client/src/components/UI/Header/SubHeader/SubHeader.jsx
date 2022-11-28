const SubHeader = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Accueil
              </a>
            </li>
            <li className="nav-item">
              <div className="dropdown text-end">
                <a
                  href="#"
                  className="d-block nav-link text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Apprendre
                </a>
                <ul className="dropdown-menu text-small">
                  <li>
                    <a className="dropdown-item" href="#">
                      New project...
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Accreditations
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Communaute
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Pour les entreprises
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default SubHeader;
