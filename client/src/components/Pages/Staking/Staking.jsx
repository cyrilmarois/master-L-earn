import { useEffect, useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import "./Staking.css";

const Staking = () => {
  const {
    state: { contract, accounts },
  } = useEth();
  const [amount, setAmount] = useState("0");

  const sendAllTokens = () => {};
  const handleStaking = async () => {
    try {
      await contract.methods.stake().call();
      await contract.methods.stake();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.debug("JARVIS");
    const initUserTokenAmount = () => {
      setAmount(1500);
      console.debug({ amount });
    };

    initUserTokenAmount();
  }, [contract, accounts]);

  return (
    <div id="staking">
      <h1 className="text-center p-3">Programme de staking du MLE</h1>

      <section className="container d-flex justify-content-evenly text-center pt-3">
        <div className="bloc col-3 staking-1 p-3">
          <h3>Plan 1</h3>
          <p>
            Periode de blocage : 6 mois
            <br />
            APR : 10%
            <br />
            Minimum deposable : 500 MLE <br />
            Maximum de tokens deposables : 1 000 000 MLE
          </p>
          <hr />
          <p>
            Nombre de tokens deposes : 10 000 MLE
            <br />
            Nombre de staker : 654
          </p>
        </div>
        <div className="bloc col-3 staking-2 p-3">
          <h3>Plan 2</h3>
          <p>
            Periode de blocage : 12 mois
            <br />
            APR : 16%
            <br />
            Minimum deposable : 1500 MLE
            <br />
            Maximum de tokens deposables : 2 500 000 MLE
          </p>
          <hr />
          <p>
            Nombre de tokens deposes : 3500 MLE
            <br />
            Nombre de staker : 4612
          </p>
        </div>
        <div className="bloc col-3 staking-1 p-3">
          <h3>Plan 3</h3>
          <p>
            Periode de blocage : 24 mois
            <br />
            APR : 20%
            <br />
            Minimum deposable : 1000 MLE
            <br />
            Maximum de tokens deposables : 5 000 000 MLE
          </p>
          <hr />
          <p>
            Nombre de tokens deposes : 1 890 000 MLE
            <br />
            Nombre de staker : 11309
          </p>
        </div>
      </section>
      <hr />
      <section className="container d-flex justify-content-evenly text-center pt-3">
        <div className="bloc col-3 staking-1 p-3">
          <h3>Plan 1</h3>
          <div className="mb-3">
            <label htmlFor="userTokenAmount" className="form-label">
              Token :{" "}
              <a href="#" onClick={sendAllTokens}>
                1500
              </a>
            </label>
          </div>
          <label htmlFor="userTokenStakeAmount" className="form-label">
            Montant a staker
          </label>

          <div className="mb-3 input-group">
            <input
              type="number"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="MLE"
              defaultValue={amount}
            />
            <span className="input-group-text">MLE</span>
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary mb-3"
              onClick={handleStaking}
            >
              STAKE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Staking;
