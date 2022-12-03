import "./Login.css";

const Login = () => {
  return (
    <section id="login" className="container">
      <div className="d-flex justify-content-evenly align-items-end  text-center">
        <div className="card justify-content-center align-items-center pt-3">
          <div className="title mb-3">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id
            aliquam erat, a vulputate justo. Suspendisse placerat scelerisque mi
            ut commodo.
          </p>
          <div className="align-items-end">
            <a href="#" className="btn btn-primary">
              DEVENIR APPRENANT
            </a>
          </div>
        </div>
        <div className="card justify-content-center align-items-center pt-3">
          <div className="title mb-3">
            <i className="fa-solid fa-person-chalkboard"></i>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id
            aliquam erat, a vulputate justo. Suspendisse placerat scelerisque mi
            ut commodo.
          </p>
          <a href="#" className="btn btn-primary">
            DEVENIR FORMATEUR
          </a>
        </div>
      </div>
    </section>
  );
};

export default Login;
