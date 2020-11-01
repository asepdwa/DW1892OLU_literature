import React, { useContext, useEffect, Suspense, useState } from "react";
import { ReactQueryConfigProvider } from "react-query";
import AppRouter from "./Routes/Router";

import { LoginContext } from "./Context/Login";
import { API, setAuthToken } from "./Config/Api";

import LoadingScreen from "./Component/LoadingScreen";
import Splash from "./Pages/Splash";

import "./Assets/App.css";

const queryConfig = {
  suspense: true,
};

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default function App() {
  // eslint-disable-next-line
  const [state, dispatch] = useContext(LoginContext);
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await API.get("/auth");

        dispatch({
          type: "LOAD_USER",
          payload: res.data.data,
        });
      } catch (err) {
        dispatch({
          type: "AUTH_ERROR",
        });
      }
      setAuth(true);
    }

    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return !isAuth ? (
    <Splash />
  ) : (
    <ReactQueryConfigProvider config={queryConfig}>
      <Suspense fallback={<LoadingScreen />}>
        <AppRouter />
      </Suspense>
    </ReactQueryConfigProvider>
  );
}
