import React from "react";
import Nav from "../nav";
import dynamic from 'next/dynamic';


const Zoom = dynamic(
  () => import('../NOSSRComponent/Zoom'),
  {
    ssr: false,
  }
)

const Main = () => {
  return (
    <div>
      <Nav />
      <Zoom />
    </div>
  );
};

export default Main;
