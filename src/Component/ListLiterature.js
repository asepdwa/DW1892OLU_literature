import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useQuery } from "react-query";

import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";
import LoadingScreen from "./LoadingScreen";

const style_X = {
  position: "absolute",
  top: 5,
  left: "73%",
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

export default function ListLiterature(props) {
  const [state, dispatch] = useContext(LoginContext);
  const { from, to, searchKeyword, status, myCollection, myLiterature } = props;
  const { loading, error, data: literatures, refetch } = useQuery(
    "getLiteraturesData",
    async () =>
      await API.get(
        `/literatures?from=${from || ""}&to=${to || ""}&q=${
          searchKeyword || ""
        }&status=${status || ""}`
      )
  );

  useEffect(() => {
    refetch();
  }, [from, to, searchKeyword]);

  const [modalState, setModal] = useState({
    show: false,
    message: "",
    alertType: "alert-success",
  });

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/literature/${id}`);
      try {
        const resAuth = await API.get("/auth");

        dispatch({
          type: "LOAD_USER",
          payload: resAuth.data.data,
        });
      } catch (error) {
        dispatch({
          type: "AUTH_ERROR",
        });
      }

      setModal({
        show: true,
        message: res.data.message,
        alertType: "alert-success",
      });
      refetch();
    } catch (error) {
      setModal({
        show: true,
        message: error.response.message,
        alertType: "alert-danger",
      });
    }
  };

  if (loading || !literatures) {
    return error ? <h1>error {error.message} </h1> : <LoadingScreen />;
  } else {
    let datas = myCollection
      ? state.userData.collections_data
      : myLiterature
      ? literatures.data.data.filter(
          (literature) => literature.uploader.id === state.userData.id
        )
      : literatures.data.data;

    return (
      <div className="row mt-4">
        {datas.length > 0 ? (
          datas.map((literature, index) => (
            <div
              key={index}
              className={myLiterature || myCollection ? "col-sm-2" : "col-sm-3"}
            >
              {literature.status !== "Approved" && (
                <div className="need-confirm">
                  <p
                    style={{ color: literature.status === "Canceled" && "red" }}
                  >
                    {literature.status}
                  </p>
                </div>
              )}
              <div className="list-book">
                <Link to={`/Detail/${literature.id}`}>
                  <img src="thumb.png" alt={literature.title} />
                </Link>
                {myLiterature && (
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
                    <p className="col">{literature.author}</p>
                    <p className="col">
                      {literature.publication.substring(0, 4)}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{ width: "95%", margin: "auto", display: "block" }}
            className="alert alert-danger"
            role="alert"
          >
            <h4 className="alert-heading" style={{ textAlign: "center" }}>
              {searchKeyword
                ? `Result: ${searchKeyword} Not found`
                : myCollection
                ? "You don't have literature that added to your collection"
                : myLiterature
                ? "You don't have any literature"
                : "Literature is not found"}
            </h4>
          </div>
        )}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={modalState.show}
          onHide={() => setModal({ ...modalState, show: false })}
        >
          <div
            className={`alert ${modalState.alertType}`}
            style={{ margin: 10, textAlign: "center" }}
          >
            <h4>{modalState.message}</h4>
          </div>
        </Modal>
      </div>
    );
  }
}
