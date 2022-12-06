import "./Main.css";

import NoticeWrongNetwork from "../Notice/NoticeWrongNetwork";
import NoticeNoArtifact from "../Notice/NoticeNoArtifact";
import Home from "../../Pages/Home/Home";
import Login from "../../Pages/Login/Login";
import Staking from "../../Pages/Staking/Staking";

const Main = () => {
  return (
    <main>
      {/* <NoticeWrongNetwork />
      <NoticeNoArtifact /> */}
      {/* <Home /> */}
      {/* <Login /> */}
      <Staking />
    </main>
  );
};

export default Main;
