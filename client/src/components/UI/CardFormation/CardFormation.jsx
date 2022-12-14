import "./CardFormation.css";
import logo from "../../../images/Alyra-logo.png";
import React, { useEffect, useState } from "react";
import { useEth } from "../../../contexts/EthContext";
import toast from "react-hot-toast";
import moment from "moment";
import ErrorHelper from "../../Helpers/ErrorHelper";

const CardFormation = (props) => {
  const {
    state: { web3, accounts, contractMLE },
  } = useEth();
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleBuyFormation = async () => {
    // let tmpBalance = await contractMLE.methods
    //   .balanceOf(accounts[0])
    //   .call({ from: accounts[0] });

    // tmpBalance = web3.utils.fromWei(tmpBalance, "ether");

    const myPromise = new Promise(async (resolve, reject) => {
      try {
        await contractMLE.methods
          .buyFormation(props.teacherAddress, props.formationId)
          .call({
            from: accounts[0],
          });
        await contractMLE.methods
          .buyFormation(props.teacherAddress, props.formationId)
          .send({
            from: accounts[0],
          });
        resolve("Buy formation success");
      } catch (e) {
        console.error(e);
        const error = ErrorHelper.parseError(e);
        reject(error);
      }
    });

    toast.promise(myPromise, {
      loading: "Transaction en cours...",
      success: <b>Achat réalisé avec succès.</b>,
      error: (err) => `Erreur lors de la transaction : ${err.toString()}`,
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
    <div id="card-formation" className="d-flex-inline p-3">
      <div className="row">
        <img className="thumbnail" src={logo} alt="logo" />
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

      <div className="d-flex justify-content-between align-items-end">
        <div className="price">{!props.basket ? price * 2 : price} MLE</div>
        {!props.basket ? (
          <div>
            <span onClick={handleBuyFormation}>
              <i className="fa-solid fa-basket-shopping"></i>
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CardFormation;
