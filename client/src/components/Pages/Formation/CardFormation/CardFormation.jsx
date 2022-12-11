import "./CardFormation.css";
import logo from "../../../../images/Alyra-logo.png";

const CardFormation = (props) => {
  console.log({ props });
  return (
    <div id="card">
      <img className="thumbnail" src={logo} />
      <div className="d-flex">
        <div className="title mt-2 flex-grow-1">{props.title}</div>
        <div className="mt-2">
          {props.rating}
          <i className="bi bi-star-fill"></i>
        </div>
        <div className="mt-2">{props.duration}</div>
      </div>

      <div>
        {/* <p className="author">Auteur : {props.teacherFullName}</p> */}
        <p className="author">{props.creationDate}</p>
        <p className="tags">{props.tags.join(", ")}</p>
        <p className="price">{props.price} MLE</p>
      </div>
    </div>
  );
};

export default CardFormation;
