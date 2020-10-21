import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { LoginContext } from "../Context/Login";
import LoadingScreen from "../Component/LoadingScreen";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [state] = useContext(LoginContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        state.loading ? (
          <LoadingScreen />
        ) : state.isLogin ? !state.userData ? <LoadingScreen /> : (
          <Component {...props} />
        ) : (
              <Redirect to="/" />
            )
      }
    />
  );
};

export default PrivateRoute;