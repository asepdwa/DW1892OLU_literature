import React from "react";
import { Link } from "react-router-dom";

const style_X = {
  position: "absolute",
  top: 5,
  left: "78%",
  backgroundColor: "#555",
  color: "white",
  fontSize: 16,
  fontWeight: 600,
  padding: 2,
  width: 25,
  borderRadius: "100%",
  display: "block",
  zIndex: 10,
  textAlign: "center",
};

export default function Literature(props) {
  const { literature, index, handleDelete, profile } = props;

  return (
    <div key={index} className="col-sm-3">
      {literature.status !== "Approved" && (
        <div className="need-confirm">
          <p style={{ color: literature.status === "Canceled" && "red" }}>
            {literature.status}
          </p>
        </div>
      )}
      <div className="list-book">
        <Link to={`/Detail/${literature.id}`}>
          <img src={literature.thumbnailUrl} alt={literature.title} />
        </Link>
        {profile && (
          <button
            onClick={() => handleDelete(literature.id)}
            className="btn"
            style={style_X}
          >
            {" "}
            X{" "}
          </button>
        )}
        <br />
        <Link
          style={{ textDecoration: "none", color: "white" }}
          to={`/Detail/${literature.id}`}
        >
          <h4 className="mt-4">{literature.title}</h4>
          <div className="row">
            <p className="col-8">
              <div className="float-left">{literature.author}</div>
            </p>
            <p className="col">
              <div className="float-right">
                {literature.publication.substring(0, 4)}
              </div>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
