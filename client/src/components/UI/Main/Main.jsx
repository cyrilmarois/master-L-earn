import "./Main.css";

import Filters from "./Filters/Filters";
import NoticeWrongNetwork from "../Notice/NoticeWrongNetwork";
import NoticeNoArtifact from "../Notice/NoticeNoArtifact";
import Home from "../../Pages/Home/Home";

const Main = () => {
  return (
    <main>
      <Filters />
      {/* <NoticeWrongNetwork />
      <NoticeNoArtifact /> */}
      <Home />
    </main>
  );
};

export default Main;
