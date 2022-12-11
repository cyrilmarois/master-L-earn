import "./Main.css";
import React from "react";

import NoticeWrongNetwork from "../Notice/NoticeWrongNetwork";
import NoticeNoArtifact from "../Notice/NoticeNoArtifact";
import { Outlet } from "react-router-dom";
import { useEth } from "../../../contexts/EthContext";

const Main = () => {
  const { state } = useEth();

  return (
    <main>
      {/* {!state.artifact ? (
        <NoticeNoArtifact />
      ) : !state.contract ? (
        <NoticeWrongNetwork />
      ) : (
        <Outlet />
      )} */}
      <Outlet />
    </main>
  );
};

export default Main;
