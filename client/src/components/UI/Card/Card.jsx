import "./Card.css";
import logo from "../../../images/Alyra-logo.png";
import React from "react";

const Card = (props) => {
  // return <div className="row">{{ children }}</div>;
  return (
    // <div id="card" className="d-inline-flex justify-content-between">
    <div id="card">
      <img className="thumbnail" src={logo} />
      <div className="d-flex">
        <div className="title mt-2 flex-grow-1">{props.title}</div>
        <div className="mt-2">
          {props.rating}
          <i className="bi bi-star-fill"></i>
        </div>
      </div>

      <div>
        <p className="author">Auteur : {props.teacherFullName}</p>
        {/* <p className="author">{props.creationDate}</p> */}
        <p className="tags">blockchain, web3</p>
        <p className="price">{props.price} MLE</p>
      </div>
    </div>
  );
};

export default Card;
