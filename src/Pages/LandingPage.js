import React from "react";
import LandingPageButton from "../Component/LandingPageButton";
import Navbar from "../Component/Navbar";

const imgContent = {
  width: "90%",
  height: "auto",
  marginTop: -40,
  marginLeft: -30,
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="container-fluid mb-4 text-white">
        <div className="row">
          <div className="col-sm-6">
            <div className="lp-left">
              <p className="quote">
                source <i>of</i>
                <br />
                intelligence
              </p>
              <p className="note">
                Sign-up and receive unlimited accesss to all
                <br />
                of your literature - share your literature.
              </p>
              <br />
              <LandingPageButton />
            </div>
          </div>
          <div className="col-sm-6">
            <img alt="Content" style={imgContent} src="content.png"></img>
          </div>
        </div>
      </div>
    </>
  );
}
