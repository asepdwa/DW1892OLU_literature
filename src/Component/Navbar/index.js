import React, { useContext } from "react";
import { Navbar } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";

import { LoginContext } from "../../Context/Login";

import NavMenu from "./NavMenu";
import NavBrand from "./NavBrand";

export default function NavHeader(props) {
  const [state, dispatch] = useContext(LoginContext);
  const history = useHistory();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    history.push("/");
  };

  return (
    <div className="container-xl">
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        style={{
          backgroundColor: "#161616",
          marginTop: 20,
          padding: 0,
        }}
      >
        {isMobile && <NavBrand />}
        {props.homePage && (
          <NavMenu
            handleLogout={handleLogout}
            isAdmin={state.userData?.role === "Admin"}
          />
        )}
        {!isMobile && <NavBrand />}
      </Navbar>
    </div>
  );
}
