import React, { useEffect, useState } from "react";

import { verify } from "jsonwebtoken";
import dynamic from 'next/dynamic';


const Zoom = dynamic(
  () => import('../components/NOSSRComponent/Zoom'),
  {
    ssr: false,
  }
)

export default () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      let isLogin;
      try {
        isLogin = !!localStorage.getItem("token")
          ? await verify(localStorage.getItem("token"), "secretToken")
          : false;
      } catch (e) {
        isLogin = false;
      }
      setAuth(isLogin);
    }
    checkLogin();
  }, []);

  return (
    <div>
      {!!auth ? <Zoom /> : <></>}
    </div>
  );
};
