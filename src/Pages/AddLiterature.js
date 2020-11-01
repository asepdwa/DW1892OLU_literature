import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import { Modal } from "react-bootstrap";

import { BiBookAdd } from "react-icons/bi";

import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";

import CustomInput from "../Component/CustomInput";
import LoadingScreen from "../Component/LoadingScreen";

import { useFormik } from "formik";
import * as yup from "yup";

const FILE_SIZE = 10 * 1000 * 1000; // 10 Megabyte
const SUPPORTED_FORMATS = "application/pdf";

export default function AddBook() {
  const [state] = useContext(LoginContext);
  const [modalState, setModal] = useState({
    show: false,
    message: "",
    alertType: "alert-success",
  });

  const {
    handleSubmit,
    getFieldProps,
    errors,
    touched,
    values,
    setFieldValue,
    handleBlur,
  } = useFormik({
    initialValues: {
      title: "",
      publication: "",
      pages: "",
      isbn: "",
      author: "",
      file: null,
    },

    validationSchema: yup.object().shape({
      title: yup.string().required("Title is required").min(3, "Too short"),
      publication: yup.string().required("Publication date is required"),
      pages: yup.string().required("Pages number is required"),
      isbn: yup
        .string()
        .required("ISBN number is required")
        .min(6, "Too short"),
      author: yup.string().required("Author Name is required"),
      file: yup
        .mixed()
        .required("A file is required")
        .test(
          "fileSize",
          "File too large, 10mb maximum",
          (value) => value && value.size <= FILE_SIZE
        )
        .test(
          "fileFormat",
          "Unsupported Format",
          (value) => value && SUPPORTED_FORMATS.includes(value.type)
        ),
    }),

    onSubmit: (values) => {
      console.log("ok");
      handleAdd(values);
    },
  });

  const [handleAdd, { isLoading, error }] = useMutation(async (value) => {
    try {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      let body = new FormData();
      body.append("title", value.title);
      body.append("publication", value.publication);
      body.append("userId", state.userData.id);
      body.append("pages", value.pages);
      body.append("isbn", value.isbn);
      body.append("author", value.author);
      body.append("file", value.file);
      body.append(
        "status",
        state.userData.role === "Admin" ? "Approved" : "Waiting to be verified"
      );

      const res = await API.post("/literature", body, config);
      setModal({
        show: true,
        message: res.data.message,
        alertType: "alert-success",
      });
    } catch (err) {
      console.log(err);
      setModal({
        show: true,
        message: err.response.data.error.message,
        alertType: "alert-success",
      });
    }
  });

  const handleChangeFile = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    if (file) {
      setFieldValue(e.target.name, file);
    }
  };

  if (error) {
    setModal({ show: true, message: error, alertType: "alert-danger" });
  }

  return (
    <div className="container-xl text-white">
      <form onSubmit={handleSubmit}>
        <br />
        <div className="form-group">
          <h3 className="list-title" style={{ paddingLeft: 0 }}>
            Add Literature
          </h3>
        </div>
        <CustomInput
          type="text"
          name="title"
          placeholder="Title"
          {...getFieldProps("title")}
          error={touched.title ? errors.title : ""}
        />
        <CustomInput
          type="date"
          name="publication"
          placeholder="Publication date"
          {...getFieldProps("publication")}
          error={touched.publication ? errors.publication : ""}
        />
        <CustomInput
          type="number"
          name="pages"
          placeholder="Pages number"
          {...getFieldProps("pages")}
          error={touched.pages ? errors.pages : ""}
        />
        <CustomInput
          type="text"
          name="isbn"
          placeholder="ISBN"
          {...getFieldProps("isbn")}
          error={touched.isbn ? errors.isbn : ""}
        />
        <CustomInput
          type="text"
          name="author"
          placeholder="Author Name, Ex: Mas irwanto"
          {...getFieldProps("author")}
          error={touched.author ? errors.author : ""}
        />
        <div className="custom-file" style={{ marginBottom: 30 }}>
          <input
            type="file"
            name="file"
            id="custom-input"
            className="custom-file-input"
            accept=".pdf"
            onChange={handleChangeFile}
            onBlur={handleBlur}
            touched={touched["file"]}
          />
          <label
            id="custom-input"
            onBlur={handleBlur}
            className="custom-file-label"
          >
            {!values.file
              ? "Attache Literature File (Only Pdf Supported)"
              : values.file.name}
          </label>
          <span className="help-block text-danger">
            {touched.file ? errors.file : ""}
          </span>
        </div>
        {isLoading ? (
          <LoadingScreen size="2.5rem" />
        ) : (
          <button
            className="btn btn-danger"
            type="submit"
            style={{ background: "#af2e1c", float: "right" }}
          >
            Add Literature <BiBookAdd size="24" />
          </button>
        )}
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
    </div>
  );
}
