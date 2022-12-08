import "./Plan.css";

const Plan = (props) => {
  return (
    <div className="bloc col-3 staking-1 p-3">
      <h3>{props.title}</h3>
      <p>
        Periode de blocage : {props.lockPeriod} mois
        <br />
        APR : {props.apr}%
        <br />
        Minimum deposable : {props.minAmount} MLE <br />
        Maximum de tokens deposables : {props.maxAmount} MLE
      </p>
      <hr />
      <p>
        Nombre de tokens deposes : {props.tokenDeposit} MLE
        <br />
        Nombre de staker : {props.stakerTotal}
      </p>
    </div>
  );
};

export default Plan;