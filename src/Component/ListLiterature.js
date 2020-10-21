import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap"
import { useQuery } from "react-query";
import { DocumentPdf } from "grommet-icons";

import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";
import LoadingScreen from "./LoadingScreen";

export default function ListLiterature(props) {
  const [state, dispatch] = useContext(LoginContext);
  const { loading, error, data: books, refetch } = useQuery(
    "getBooksData",
    async () => await API.get("/books")
  );
  const [modalState, setModal] = useState({ show: false, message: "", alertType: "alert-success" });

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/book/${id}`);
      refetch();
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

      setModal({ show: true, message: res.data.message, alertType: "alert-success" });
    } catch (error) {
      setModal({ show: true, message: error.response.message, alertType: "alert-danger" });
    }
  };

  if (loading || !books) {
    return error ? (
      <h1>error {error.message} </h1>
    ) : <LoadingScreen />;
  } else {
    let bookData = props.myCollection
      ? state.userData.bookmarks_data
      : props.myBook
        ? books.data.data.filter((book) => book.userId === state.userData.id)
        : books.data.data.filter((book) => book.status === "Approved");

    bookData = props.searchKeyword ? bookData.filter((book) => {
      if (props.searchKeyword == null)
        return book
      else if (book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())) {
        return book
      }
    }) :
      bookData;
    console.log(bookData,
      props.searchKeyword);

    return (
      <div className="row mt-4">
        {bookData.length > 0 ? bookData.map((book, index) => (
          <div key={index} className="col-sm-3">
            {book.status !== "Approved" && (
              <div className="need-confirm">
                <p style={{ color: book.status === "Canceled" && "red" }}>{book.status}</p>
              </div>
            )}
            <div className="list-book">
              <Link to={`/Detail/${book.id}`}>
                <DocumentPdf size="xlarge" color="white" />
              </Link>
              {props.myBook && <button onClick={() => handleDelete(book.id)} className="btn" style={{
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
              }}> X </button>}
              <br />
              <Link style={{ textDecoration: "none", color: "white" }} to={`/Detail/${book.id}`}>
                <h4 className="mt-4">{book.title}</h4>
                <p>{book.author} | {book.publication.substring(0, 4)}</p>
              </Link>
            </div>
          </div>
        )) : (<div style={{ width: "95%", margin: "auto", display: "block" }} className="alert alert-danger" role="alert">
          <h4 className="alert-heading" style={{ textAlign: "center" }}>{
            props.searchKeyword
              ? "Not found"
              : props.myCollection ? "You don't have literature that added to your collection"
                : props.myBook ? "You don't have any literature"
                  : "Book is not found"}</h4>
        </div>)
        }
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
      </div >
    );
  }
}
