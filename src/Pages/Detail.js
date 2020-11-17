import React, { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import fileDownload from "js-file-download";
import { useQuery } from "react-query";
import { API } from "../Config/Api";
import { FaRegBookmark, FaTrashAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { LoginContext } from "../Context/Login";
import LoadingScreen from "../Component/LoadingScreen";

export default function Detail() {
  const [state, dispatch] = useContext(LoginContext);
  const [modalState, setModal] = useState({
    show: false,
    message: "",
    alertType: "alert-success",
  });

  const { id } = useParams();

  const { loading, error, data: literature } = useQuery(
    "getLiteratureDetail",
    async () => await API.get(`/literature/${id}`)
  );

  const handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(
          res.data,
          filename + "." + url.split(/[#?]/)[0].split(".").pop().trim()
        );
      });
  };

  const AddToMyCollection = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({
        UserId: state.userData.id,
        LiteratureId: parseInt(id),
      });
      const res = await API.post("/collection", body, config);

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
    } catch (err) {
      setModal({
        show: true,
        message: err.response.data.message,
        alertType: "alert-danger",
      });
    }
  };

  const removeFromMyCollection = async () => {
    try {
      const res = await API.delete(`/collection/${parseInt(id)}`);

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
        alertType: "alert-warning",
      });
    } catch (err) {
      setModal({
        show: true,
        message: err.response.data.message,
        alertType: "alert-danger",
      });
    }
  };

  if (loading || !literature) {
    return error ? <h1>error {error.message} </h1> : <LoadingScreen />;
  } else {
    return error ? (
      <h1>error {error.message} </h1>
    ) : (
      <div className="container-xl text-white mb-2">
        <div className="row">
          <div className="col-sm-4">
            <img
              src={literature.data.data.thumbnailUrl}
              alt={literature.data.data.title}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="col-sm-6">
            <h3
              contenteditable="true"
              style={{
                fontSize: 45,
                fontFamily: "Times New Roman",
                fontWeight: 750,
              }}
            >
              {literature.data.data.title}{" "}
            </h3>
            <p className="detail-data" style={{ fontSize: 18 }}>
              {literature.data.data.author}
            </p>
            <p className="detail-type">Publication Date</p>
            <p className="detail-data">
              {literature.data.data.publication.substring(0, 10)}
            </p>
            <p className="detail-type">Uploaded by</p>
            <p className="detail-data">
              {literature.data.data.uploader.fullName}
            </p>
            <p className="detail-type">Pages</p>
            <p className="detail-data">{literature.data.data.pages}</p>
            <p className="detail-type" style={{ color: "#ee4622" }}>
              ISBN
            </p>
            <p className="detail-data">{literature.data.data.isbn}</p>
            <button
              onClick={() =>
                handleDownload(
                  literature.data.data.fileUrl,
                  literature.data.data.title
                )
              }
              className="btn-custom"
              style={{ width: 150, marginLeft: 0 }}
            >
              Download
            </button>
            <a
              href={literature.data.data.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="btn-custom"
                style={{ width: 150, marginLeft: 0 }}
              >
                Read
              </button>
            </a>
          </div>
          <div className="col-sm-2 mt-3">
            {state.userData.collections_data.some(
              (collection) => collection.id === parseInt(id)
            ) ? (
              <button
                className="btn-custom"
                style={{ width: 190, marginTop: 0, marginRight: 10 }}
                onClick={() => removeFromMyCollection()}
              >
                Remove Collection <FaTrashAlt />
              </button>
            ) : (
              <button
                className="btn-custom"
                style={{ width: 190, marginTop: 0 }}
                onClick={() => AddToMyCollection()}
              >
                Add My Collection <FaRegBookmark />
              </button>
            )}
          </div>
        </div>

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
