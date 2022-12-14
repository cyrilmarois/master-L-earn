import React from "react";
import Announces from "./Announces/Announces";
import Formations from "./Formations/StudentFormations";

const Student = () => {
  return (
    <div id="Student">
      <div className="container p-5">
        <Formations />
        {/* <Announces /> */}
      </div>
    </div>
  );
};

export default Student;
