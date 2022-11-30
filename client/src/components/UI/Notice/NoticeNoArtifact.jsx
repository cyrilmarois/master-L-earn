import "./Notice.css";

function NoticeNoArtifact() {
  return (
    <div id="notice">
      <div className="container-sm">
        <div className="row d-inline-flex justify-content-center align-items-center ps-3 pe-3 mt-3">
          <div className="col-md justify-content-center">
            <p>
              Cannot find SimpleStorage contract artifact. Please complete the
              above preparation first, then restart the react dev server.
            </p>
            <button type="button" className="btn btn-primary">
              Change network
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeNoArtifact;
