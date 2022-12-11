import "./Plan.css";
import React from "react";

const Plan = (props) => {
  return (
    <div className="bloc col-3 staking-1 p-3">
      <h3>{props.title}</h3>
      <p>
        APR : {props.apr}%
        <br />
        Période de blocage : {props.lockPeriod} mois
        <br />
        Minimum déposable : {props.minAmount} MLE <br />
        Maximum déposable : {props.maxAmount} MLE
      </p>
      <hr />
      <p>
        Nombre de tokens stake : {props.tokenDeposit} MLE
        <br />
        Nombre de staker : {props.totalStaker}
      </p>
    </div>
  );
};

export default Plan;
