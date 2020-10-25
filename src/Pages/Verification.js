import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FcApproval } from "react-icons/fc";
import { FaTrashAlt } from "react-icons/fa"
import { useQuery, useMutation } from "react-query";
import { Modal } from "react-bootstrap";

import { API } from "../Config/Api";
import LoadingScreen from "../Component/LoadingScreen";

export default function Verification() {
  const { loading, error, data: books, refetch } = useQuery(
    "getBooksData",
    async () => await API.get("/books")
  );

  const [modalState, setModal] = useState({ show: false, message: "", alertType: "alert-success" });

  const [handleApprove] = useMutation(async (id) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const body = JSON.stringify({ status: "Approved" })
      const res = await API.patch(`/book/${id}`, body, config)
      refetch();
      setModal({ show: true, message: res.data.message, alertType: "alert-success" })
    } catch (error) {
      setModal({ show: true, message: error.response.data.message, alertType: "alert-danger" })
    }
  });

  const [handleCancel] = useMutation(async (id) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const body = JSON.stringify({ status: "Canceled" })
      const res = await API.patch(`/book/${id}`, body, config)
      refetch();
      setModal({ show: true, message: res.data.message, alertType: "alert-success" })
    } catch (error) {
      setModal({ show: true, message: error.response.data.message, alertType: "alert-danger" })
    }
  });

  const [handleDelete] = useMutation(async (id) => {
    try {
      const res = await API.delete(`/book/${id}`)
      refetch();
      setModal({ show: true, message: res.data.message, alertType: "alert-success" })
    } catch (error) {
      setModal({ show: true, message: error.response.data.message, alertType: "alert-danger" })
    }
  });

  if (loading || !books) {
    return error ? (
      <h1>error {error.message} </h1>
    ) : <LoadingScreen />;
  } else {
    let bookData = books.data.data;

    return (
      <div className="container-xl text-white mt-4 mb-4">
        <div className="table-responsive">
          <h4 className="list-title" style={{ padding: 0 }}>
            Book Verification
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
              {bookData.map((book, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{book.uploader.fullName}</td>
                  <td>{book.isbn}</td>
                  <td style={{ fontSize: 12, fontWeight: 700 }}>
                    <Link to={`/Detail/${book.id}`}>
                      {book.fileUrl.split("/")[book.fileUrl.split("/").length - 1].substring(0, 40)}
                    </Link>
                  </td>
                  {book.status === "Approved" ? (
                    <>
                      <td
                        className="text-success"
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        {book.status}
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
                            book.status === "Canceled"
                              ? "text-danger"
                              : "text-warning"
                          }
                          style={{ fontSize: 12, fontWeight: 700 }}
                        >
                          {book.status}
                        </td>
                        <td>
                          <center>
                            {book.status !== "Canceled" && (
                              <button
                                onClick={() => handleCancel(book.id)}
                                className="btn btn-danger"
                              >
                                Cancel
                              </button>
                            )}{" "}
                            <button
                              onClick={() => handleApprove(book.id)}
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
                        onClick={() => handleDelete(book.id)}
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