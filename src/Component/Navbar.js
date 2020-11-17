import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LoginContext } from "../Context/Login";
import { Link, useHistory } from "react-router-dom";

export default function Header(props) {
  const [state, dispatch] = useContext(LoginContext);
  const history = useHistory();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    history.push("/");
  };

  const navLinkStyle = {
    color: "#f0f0f0",
    fontSize: 22,
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
        {props.homePage && (
          <>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Link className="nav-link" to="/Profile" style={navLinkStyle}>
                  Profile
                </Link>
                <Link
                  className="nav-link"
                  to="/Collection"
                  style={navLinkStyle}
                >
                  My Collection
                </Link>
                <Link className="nav-link" to="/Add" style={navLinkStyle}>
                  Add Literature
                </Link>
                {state.userData?.role === "Admin" && (
                  <Link
                    className="nav-link"
                    to="/Verification"
                    style={navLinkStyle}
                  >
                    Verification
                  </Link>
                )}
                <Nav.Link onClick={handleLogout} style={navLinkStyle}>
                  Logout
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
        <Link to="/Home">
          <Navbar.Brand style={{ marginRight: -15 }}>
            <img
              style={{
                width: 200,
                height: "auto",
              }}
              src="logo.png"
              alt="icon"
            />
          </Navbar.Brand>
        </Link>
      </Navbar>
    </div>
  );
}
