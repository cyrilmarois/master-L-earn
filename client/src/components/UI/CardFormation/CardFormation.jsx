import "./CardFormation.css";
import logo from "../../../images/Alyra-logo.png";
import React, { useEffect, useState } from "react";
import { useEth } from "../../../contexts/EthContext";
import toast from "react-hot-toast";
import moment from "moment";

const CardFormation = (props) => {
  const {
    state: { web3, accounts, contractMLE },
  } = useEth();
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleBuyFormation = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contractMLE.methods.buyFormation().call();
        resolve("Buy formation success");
      } catch (e) {
        console.error(e);
        reject("Buy formation failed");
      }
      toast.promise(myPromise, {
        loading: "Achat en cours...",
        success: <b>Achat réalisé avec succès.</b>,
        error: <b>Erreur durant l'achat.</b>,
      });
    });
  };

  useEffect(() => {
    // console.log({ props });
    if (web3) {
      if (props.tags && props.tags.length !== 0) {
        setTags(props.tags.join(", "));
      }
      if (props.price !== "" || props.price !== "0") {
        setPrice(web3.utils.fromWei(props.price, "ether"));
      }
      if (props.duration !== "" || props.duration !== "0") {
        setDuration(moment.utc(props.duration * 1000).format("HH:mm:ss"));
      }
    }
  }, [accounts, contractMLE]);

  return (
    <div id="card" className="d-flex-inline p-3">
      <div className="row">
        <img className="thumbnail" src={logo} />
      </div>
      <div className="d-flex">
        <div className="title mt-2 flex-grow-1">{props.title}</div>
        <div className="mt-2">
          {props.rating}
          <i className="bi bi-star-fill"></i>
        </div>
      </div>

      <div className="mt-2">{duration}</div>

      <div>
        <p className="author">Publiée le : {props.creationDate}</p>
        <p className="tags">{tags}</p>
      </div>

      {!props.basket ? (
        <div className="d-flex justify-content-between align-items-end">
          <div className="price">{price} MLE</div>
          <div>
            <span onClick={handleBuyFormation}>
              <i className="fa-solid fa-basket-shopping"></i>
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CardFormation;
