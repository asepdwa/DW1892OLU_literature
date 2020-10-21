import React from "react";
import LandingPageButton from "../Component/LandingPageButton";
import Navbar from "../Component/Navbar";
import FilePreviewer from 'react-file-previewer';

export default function LandingPage() {
  return (<>
    <Navbar />
    <div className="container-fluid mb-4 text-white">
      <div className="row">
        <div className="col-sm-6">
          <div style={{ margin: "auto", display: "block", width: "70%", marginTop: 100 }}>
            <p className="quote">
              source <i>of</i><br />
                intelligence
        </p>
            <p className="note">
              Sign-up and receive unlimited accesss to all
          <br />
         of your literatur - share your literature.
        </p>
            <br /><LandingPageButton />
          </div>
        </div>
        <div className="col-sm-6">
          <img style={{ width: "90%", height: "auto", }} src="content.png"></img>
        </div>
      </div>
    </div>
  </>
  );
}
