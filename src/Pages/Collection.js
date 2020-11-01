import React from "react";
import ListLiterature from "../Component/ListLiterature";

export default function Collection() {
  return (
    <div className="container-xl text-white mt-4 mb-4">
      <div className="row">
        <div className="col-sm-6">
          <h4 className="list-title">My Collection</h4>
        </div>
      </div>
      <ListLiterature myCollection={true} status="Approved" />
    </div>
  );
}
