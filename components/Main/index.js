import React from "react";
import Nav from "../nav";
import { Typography } from "@material-ui/core";

const Main = () => {
  return (
    <div>
      <Nav />
      <Typography variant="h6">
        Welcome To Admin
      </Typography>
    </div>
  );
};

export default Main;
