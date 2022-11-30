import "./Main.css";

import Filters from "./Filters/Filters";
import NoticeWrongNetwork from "../Notice/NoticeWrongNetwork";
import NoticeNoArtifact from "../Notice/NoticeNoArtifact";

const Main = () => {
  return (
    <main>
      <Filters />
      {/* <NoticeWrongNetwork />
      <NoticeNoArtifact /> */}
    </main>
  );
};

export default Main;
