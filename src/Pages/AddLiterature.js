import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import { Modal } from "react-bootstrap";

import { BiBookAdd } from "react-icons/bi";
import { FaPaperclip, FaRegFileImage } from "react-icons/fa"

import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";

export default function AddBook() {
  const [state] = useContext(LoginContext);
  const [modalState, setModal] = useState({ show: false, message: "", alertType: "alert-success" });

  const [formData, setFormData] = useState({
    title: "",
    publication: "",
    pages: "",
    isbn: "",
    author: "",
    file: null,
    aboutBook: "",
  });

  const { title, publication, pages, isbn, author, thumbnail, file, aboutBook } = formData;

  const handleChange = (e) => {
    // Check Form Type
    e.target.type === "file"
      ? setFormData({ ...formData, [e.target.name]: e.target.files[0] })
      : setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [handleSubmit] = useMutation(async () => {
    if (
      title.length > 3 &&
      publication.length > 3 &&
      pages.length > 0 &&
      author.length > 3 &&
      isbn.length > 3
    ) {
      try {
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };

        let body = new FormData();
        body.append("title", title);
        body.append("publication", publication);
        body.append("userId", state.userData.id);
        body.append("pages", pages);
        body.append("isbn", isbn);
        body.append("author", author);
        body.append("file", file);
        body.append("status", state.userData.role === "Admin" ? "Approved" : "Waiting to be verified");

        const res = await API.post("/book", body, config);
        setModal({ show: true, message: res.data.message, alertType: "alert-success" });
        setFormData({
          title: "",
          publication: "",
          pages: "",
          isbn: "",
          aboutBook: "",
        });
      } catch (error) {
        setModal({ show: true, message: error.response.data.error.message, alertType: "alert-danger" });
      }
    } else {
      setModal({ show: true, message: "Fill The Form Correctly...", alertType: "alert-warning" });
    }
  });
  const marginBottom = { marginBottom: "2rem" };

  return (
    <div className="container-xl text-white">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <br />
        <div className="form-group">
          <h3 className="list-title" style={{ paddingLeft: 0 }}>
            Add Literature
          </h3>
        </div>
        <div className="form-group" style={marginBottom}>
          <input
            className="form-control"
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-group" style={marginBottom}>
          <input
            className="form-control"
            type="date"
            name="publication"
            value={publication}
            placeholder="Publication Date"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-group" style={marginBottom}>
          <input
            className="form-control"
            type="number"
            name="pages"
            value={pages}
            placeholder="Pages"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-group" style={marginBottom}>
          <input
            className="form-control"
            type="text"
            name="isbn"
            value={isbn}
            placeholder="ISBN"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-group" style={marginBottom}>
          <input
            className="form-control"
            type="text"
            name="author"
            value={author}
            placeholder="Author name, Ex: Irwanto"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-group" style={marginBottom}>
          <input
            type="file"
            className="form-control-file"
            name="file"
            id="file"
            accept=".xlsx,.xls,.doc, .docx,.ppt,.pptx,.txt,.pdf"
            onChange={(e) => handleChange(e)}
            style={{ display: "none" }}
          />
          <label for="file" className="btn btn-danger" style={{ background: "#af2e1c" }}>
            {!file ? "Attache File" : file.name} <FaPaperclip size="22" />
          </label>
        </div>
        <button
          className="btn btn-danger"
          type="submit"
          style={{ background: "#af2e1c", float: "right" }}
        >
          Add Literature <BiBookAdd size="24" />
        </button>
      </form>
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
    </div >
  );
}
