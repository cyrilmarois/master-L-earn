import "./Plan.css";
import React from "react";

const Plan = (props) => {
  return (
    <div className="bloc col-3 staking-1 p-3">
      <h3>{props.title}</h3>
      <p>
        <br />
        Période de blocage : {props.lockPeriod} mois
        <br />
        Minimum déposable : {props.minTokenAmount} MLE <br />
        Maximum déposable : {props.maxTokenAmount} MLE
      </p>
      <hr />
      <p>
        Nombre de tokens staked : {props.totalStakedValue} MLE
      </p>
    </div>
  );
};

export default Plan;
