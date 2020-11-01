import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FcApproval } from "react-icons/fc";
import { FaTrashAlt } from "react-icons/fa";
import { useQuery, useMutation } from "react-query";
import { Modal } from "react-bootstrap";

import { API } from "../Config/Api";
import LoadingScreen from "../Component/LoadingScreen";

export default function Verification() {
  const { loading, error, data: literatures, refetch } = useQuery(
    "getLiteraturesData",
    async () => await API.get("/literatures")
  );

  const [modalState, setModal] = useState({
    show: false,
    message: "",
    alertType: "alert-success",
  });

  const [handleApprove] = useMutation(async (id) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const body = JSON.stringify({ status: "Approved" });
      const res = await API.patch(`/literature/${id}`, body, config);
      refetch();
      setModal({
        show: true,
        message: res.data.message,
        alertType: "alert-success",
      });
    } catch (error) {
      setModal({
        show: true,
        message: error.response.data.message,
        alertType: "alert-danger",
      });
    }
  });

  const [handleCancel] = useMutation(async (id) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const body = JSON.stringify({ status: "Canceled" });
      const res = await API.patch(`/literature/${id}`, body, config);
      refetch();
      setModal({
        show: true,
        message: res.data.message,
        alertType: "alert-success",
      });
    } catch (error) {
      setModal({
        show: true,
        message: error.response.data.message,
        alertType: "alert-danger",
      });
    }
  });

  const [handleDelete] = useMutation(async (id) => {
    try {
      const res = await API.delete(`/literature/${id}`);
      refetch();
      setModal({
        show: true,
        message: res.data.message,
        alertType: "alert-success",
      });
    } catch (error) {
      setModal({
        show: true,
        message: error.response.data.message,
        alertType: "alert-danger",
      });
    }
  });

  if (loading || !literatures) {
    return error ? <h1>error {error.message} </h1> : <LoadingScreen />;
  } else {
    let datas = literatures.data.data;

    return (
      <div className="container-xl text-white mt-4 mb-4">
        <div className="table-responsive">
          <h4 className="list-title" style={{ padding: 0 }}>
            Literatures Verification
          </h4>
          <table className="table table-dark table-striped table-md mt-4">
            <thead>
              <tr>
                <th>No</th>
                <th>Uploader</th>
                <th>ISBN</th>
                <th>E-book</th>
                <th>Status</th>
                <th>
                  <center>Action</center>
                </th>
                <th>
                  <center>Delete</center>
                </th>
              </tr>
            </thead>
            <tbody>
              {datas.map((literature, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{literature.uploader.fullName}</td>
                  <td>{literature.isbn}</td>
                  <td style={{ fontSize: 12, fontWeight: 700 }}>
                    <Link to={`/Detail/${literature.id}`}>
                      {literature.fileUrl
                        .split("/")
                        [literature.fileUrl.split("/").length - 1].substring(
                          0,
                          40
                        )}
                    </Link>
                  </td>
                  {literature.status === "Approved" ? (
                    <>
                      <td
                        className="text-success"
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        {literature.status}
                      </td>
                      <td>
                        <center>
                          <FcApproval size="30" />
                        </center>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className={
                          literature.status === "Canceled"
                            ? "text-danger"
                            : "text-warning"
                        }
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        {literature.status}
                      </td>
                      <td>
                        <center>
                          {literature.status !== "Canceled" && (
                            <button
                              onClick={() => handleCancel(literature.id)}
                              className="btn btn-danger"
                            >
                              Cancel
                            </button>
                          )}{" "}
                          <button
                            onClick={() => handleApprove(literature.id)}
                            className="btn btn-success"
                          >
                            Approve
                          </button>
                        </center>
                      </td>
                    </>
                  )}
                  <td>
                    <center>
                      <button
                        onClick={() => handleDelete(literature.id)}
                        className="btn btn-secondary"
                      >
                        <FaTrashAlt />
                      </button>
                    </center>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {modalState.message}
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
