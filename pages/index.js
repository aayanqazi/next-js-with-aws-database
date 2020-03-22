import React, { useEffect, useState } from "react";

import Head from "../components/head";
import Login from "../components/Login";
import Main from "../components/Main";
import { verify } from "jsonwebtoken";

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
      <Head title="Rafiky" />
      {!!auth ? <Main /> : <Login />}
    </div>
  );
};
