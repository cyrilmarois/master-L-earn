import "./CardFormation.css";
import logo from "../../../images/Alyra-logo.png";
import React, { useEffect, useState } from "react";
import { useEth } from "../../../contexts/EthContext";

const CardFormation = (props) => {
  const {
    state: { web3, accounts, contract },
  } = useEth();
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    console.log({ props, web3 });
    if (web3) {
      if (props.tags && props.tags.length !== 0) {
        setTags(props.tags.join(", "));
      }
      if (props.price !== "" || props.price !== "") {
        setPrice(web3.utils.fromWei(props.price, "ether"));
      }
    }
  }, [accounts, contract]);

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
        <p className="author">{props.creationDate}</p>
        <p className="tags">{tags}</p>
        <p className="price">{price} MLE</p>
      </div>
    </div>
  );
};

export default CardFormation;
