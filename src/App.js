import React, { useContext, useEffect, Suspense, useState } from "react";
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
        })
      }
      setAuth(true);
    };

    loadUser();
  }, []);

  return !isAuth ? (
    <div className="splash-screen">
      <h3 className="mt-4" style={{
        fontFamily: "Times New Roman",
        fontSize: 65,
        fontStyle: "italic",
        fontWeight: 700,
        color: "white",
      }}>literature
      <img style={{ marginLeft: -12, marginTop: -32, width: 110, height: 110 }} src="quill-drawing-a-line.png" alt="icon" />
      </h3>
    </div>
  ) : (
      <ReactQueryConfigProvider config={queryConfig}>
        <Suspense fallback={<LoadingScreen />}>
          <AppRouter />
        </Suspense>
      </ReactQueryConfigProvider>
    );
}
