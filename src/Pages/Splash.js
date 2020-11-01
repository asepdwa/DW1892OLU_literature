import React from "react";

export default function Splash() {
  return (
    <div className="splash-screen">
      <h3
        className="mt-4"
        style={{
          fontFamily: "Times New Roman",
          fontSize: 65,
          fontStyle: "italic",
          fontWeight: 700,
          color: "white",
        }}
      >
        literature
        <img
          style={{ marginLeft: -12, marginTop: -32, width: 110, height: 110 }}
          src="quill-drawing-a-line.png"
          alt="icon"
        />
      </h3>
    </div>
  );
}
