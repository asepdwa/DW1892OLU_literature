import React from "react";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBrand(props) {
  const { to, style, imgStyle, src, alt } = props;
  return (
    <Link to={to}>
      <Navbar.Brand style={style}>
        <img style={imgStyle} src={src} alt={alt} />
      </Navbar.Brand>
    </Link>
  );
}

NavBrand.defaultProps = {
  to: "/Home",
  style: {
    marginRight: -15,
  },
  imgStyle: {
    width: 200,
    height: "auto",
  },
  src: "logo.png",
  alt: "Literature",
};
