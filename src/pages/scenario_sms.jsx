import React from "react";
import { NavLink } from "react-router-dom";

const ScenarioSMS = () => {
  return (
    <div>
      <h1>Scenario SMS Page</h1>
      <p>This is the Scenario SMS page content.</p>
      <NavLink to="/">Go back to About</NavLink>
    </div>
  );
};

export default ScenarioSMS;