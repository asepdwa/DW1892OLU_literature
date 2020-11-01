import React from "react";

export default function LoadingScreen(props) {
  const styling = {
    width: props.size || "4rem",
    height: props.size || "4rem",
    marginRight: 5,
  };
  return (
    <div className="text-center mt-4">
      <div className="spinner-grow text-primary" style={styling} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div
        className="spinner-grow text-secondary"
        style={styling}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow text-success" style={styling} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow text-danger" style={styling} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow text-warning" style={styling} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow text-info" style={styling} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow text-light" style={styling} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow text-dark" style={styling} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
