import React, { useContext, useEffect, Suspense } from "react";
import { ReactQueryConfigProvider } from "react-query";
import AppRouter from "./Routes/Router";

import "./Assets/App.css";
import { LoginContext } from "./Context/Login";
import { API, setAuthToken } from "./Config/Api";

import LoadingScreen from "./Component/LoadingScreen";

const queryConfig = {
  suspense: true,
};

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default function App() {
  // eslint-disable-next-line
  const [state, dispatch] = useContext(LoginContext);

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
        })
      }
    };

    loadUser();
  }, []);

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Suspense fallback={<LoadingScreen />}>
        <AppRouter />
      </Suspense>
    </ReactQueryConfigProvider>
  );
}
