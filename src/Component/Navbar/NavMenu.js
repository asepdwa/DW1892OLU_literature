import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const listMenu = [
  {
    title: "Profile",
    link: "/Profile",
    adminPermission: false,
  },
  {
    title: "My Collection",
    link: "/Collection",
    adminPermission: false,
  },
  {
    title: "Add Literature",
    link: "/Add",
    adminPermission: false,
  },
  {
    title: "Verification",
    link: "/Verification",
    adminPermission: true,
  },
];

export default function NavMenu(props) {
  const { handleLogout, listStyle, isAdmin } = props;
  return (
    <>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {listMenu.map((menu, index) =>
            !menu.adminPermission ? (
              <Link className="nav-link" to={menu.link} style={listStyle}>
                {menu.title}
              </Link>
            ) : (
              isAdmin && (
                <Link className="nav-link" to={menu.link} style={listStyle}>
                  {menu.title}
                </Link>
              )
            )
          )}
          <Nav.Link onClick={() => handleLogout()} style={listStyle}>
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </>
  );
}

NavMenu.defaultProps = {
  listStyle: {
    color: "#f0f0f0",
    fontSize: 22,
  },
};
