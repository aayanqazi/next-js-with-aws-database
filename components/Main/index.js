import React, { useEffect } from "react";
import Nav from "../nav";
import { Typography } from "@material-ui/core";
import dynamic from 'next/dynamic';


const Zoom = dynamic(
  () => import('../NOSSRComponent/Zoom'),
  {
    ssr: false,
  }
)

const Main = () => {
  useEffect(() => {
  }, [])
  return (
    <div>
      <Nav />
      <Zoom />
    </div>
  );
};

export default Main;
