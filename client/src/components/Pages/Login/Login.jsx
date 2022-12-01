import "./Login.css";

const Login = () => {
  return (
    <section id="login" className="container">
      <div className="d-flex justify-content-evenly align-items-end  text-center">
        <div className="card">
          <h3 className="title">APPRENANT</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id
            aliquam erat, a vulputate justo. Suspendisse placerat scelerisque mi
            ut commodo.
          </p>
          <div className="align-items-end">
            <a href="#" class="btn btn-primary">
              Poursuivre
            </a>
          </div>
        </div>
        <div className="card">
          <h3 className="title">FORMATEUR</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id
            aliquam erat, a vulputate justo. Suspendisse placerat scelerisque mi
            ut commodo.
          </p>
          <a href="#" class="btn btn-primary">
            Poursuivre
          </a>
        </div>
      </div>
    </section>
  );
};

export default Login;
