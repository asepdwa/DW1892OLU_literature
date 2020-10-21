import React, { useContext } from "react";
import { Navbar, Nav } from 'react-bootstrap'
import { LoginContext } from "../Context/Login";
import { Link, useHistory } from "react-router-dom";

export default function Header(props) {
  const [state, dispatch] = useContext(LoginContext);
  const history = useHistory();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    alert("Logout berhasil");
    history.push("/");
  };

  const navLinkStyle = {
    color: "#f0f0f0",
    fontSize: 22,
  };

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style={{
      backgroundColor: "#161616",
      marginTop: 20, paddingLeft: 50, paddingRight: 50
    }}>
      {props.homePage && (<><Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Link className="nav-link" to="/Profile" style={navLinkStyle}>Profile</Link>
            <Link className="nav-link" to="/Collection" style={navLinkStyle}>My Collection</Link>
            <Link className="nav-link" to="/Add" style={navLinkStyle}>Add Literature</Link>
            <Nav.Link onClick={handleLogout} style={navLinkStyle}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse></>)
      }
      <Link to="/Home"><Navbar.Brand style={{ fontSize: 38 }}>literature<img style={{ marginLeft: -6, marginTop: -17, width: 55, height: 55 }} src="quill-drawing-a-line.png" alt="icon" /></Navbar.Brand></Link>
    </Navbar >
  );
}
