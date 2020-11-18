import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import { Modal } from "react-bootstrap";
import { BiBookAdd } from "react-icons/bi";

import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";

import {
  CustomInput,
  CustomInputFile,
  CustomInputGroup,
} from "../Component/CustomForm";
import LoadingScreen from "../Component/LoadingScreen";
import ModalAlert from "../Component/ModalAlert";
import ImageCropper from "../Component/Cropper";

import { useFormik } from "formik";
import * as yup from "yup";

const FILE_SIZE = 10; // 10 Megabyte
const SUPPORTED_FORMATS = "application/pdf";
const SUPPORTED_FORMATS_2 = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
];

export default function AddBook() {
  const [state] = useContext(LoginContext);
  const [modalState, setModal] = useState({
    show: false,
    message: "",
    alertType: "alert-success",
  });

  const [cover, setCover] = useState({
    show: false,
    blob: null,
    image: null,
  });

  const [inputDisable, setInputDisable] = useState({
    author: false,
    isbn: false,
  });

  const getBlob = (blob) => {
    setCover({ ...cover, blob });
  };

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
      thumbnail: null,
    },

    validationSchema: yup.object().shape({
      title: yup.string().required("Title is required").min(3, "Too short"),
      publication: yup.string().required("Publication date is required"),
      pages: yup.string().required("Pages number is required"),
      isbn: yup.string().required("ISBN number is required"),
      author: yup
        .string()
        .required("Author Name is required")
        .min(3, "Too short"),
      file: yup
        .mixed()
        .required("Don't forget to attache literature file ..")
        .test(
          "fileSize",
          `File too large, ${FILE_SIZE}mb maximum`,
          (value) => value && value.size <= FILE_SIZE * 1000000
        )
        .test(
          "fileFormat",
          "Unsupported Format",
          (value) => value && SUPPORTED_FORMATS.includes(value.type)
        ),
      thumbnail: yup
        .mixed()
        .required("Don't forget to attache literature cover ..")
        .test(
          "fileSize",
          `File too large, ${FILE_SIZE}mb maximum`,
          (value) => value && value.size <= FILE_SIZE * 1000000
        )
        .test(
          "fileFormat",
          "Unsupported Format",
          (value) => value && SUPPORTED_FORMATS_2.includes(value.type)
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
      body.append("UserId", state.userData.id);
      body.append("pages", value.pages);
      body.append("isbn", value.isbn);
      body.append("author", value.author);
      body.append("file", value.file);
      body.append("thumbnail", cover.blob);
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
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (e.target.name === "thumbnail" && file.type.match("image/*")) {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
          setCover({ ...cover, show: true, image: reader.result });
        });

        reader.readAsDataURL(file);
      }
      setFieldValue(e.target.name, file);
    } else {
      setFieldValue(e.target.name, e.target.value);
    }
  };

  if (error) {
    setModal({ show: true, message: error, alertType: "alert-danger" });
  }

  return (
    <div className="container-xl text-white mb-3">
      <form autoComplete="off" onSubmit={handleSubmit} className="mb-3">
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
        <CustomInputGroup
          type="text"
          name="isbn"
          placeholder="ISBN"
          actionName={inputDisable.isbn ? "Enter ISBN" : "Without ISBN"}
          action={() => {
            setFieldValue("isbn", inputDisable.isbn ? "" : "NO ISBN");
            setInputDisable({ ...inputDisable, isbn: !inputDisable.isbn });
          }}
          disabled={inputDisable.isbn}
          {...getFieldProps("isbn")}
          error={touched.isbn ? errors.isbn : ""}
        />
        <CustomInputGroup
          type="text"
          name="author"
          placeholder="Author Name, Ex: Irwanto Wibowo"
          actionName={
            inputDisable.author ? "Enter author name" : "Author as me"
          }
          action={() => {
            setFieldValue(
              "author",
              inputDisable.author ? "" : state.userData.fullName
            );
            setInputDisable({
              ...inputDisable,
              author: !inputDisable.author,
            });
          }}
          disabled={inputDisable.author}
          {...getFieldProps("author")}
          error={touched.author ? errors.author : ""}
        />
        <CustomInputFile
          name="file"
          accept=".pdf"
          onChange={handleChangeFile}
          onBlur={handleBlur}
          touched={touched["file"]}
          touched_check={touched.file}
          errors={errors.file}
          placeholder="Attache Literature File
        (Only PDF File Supported)"
          file={values.file}
        />
        <div className="row">
          {values.thumbnail && (
            <div className="col-sm-2">
              <button
                className="btn btn-light btn-block"
                onClick={(e) => {
                  e.preventDefault();
                  setCover({ ...cover, show: true });
                }}
              >
                Adjust
              </button>
            </div>
          )}
          <div className="col">
            <CustomInputFile
              name="thumbnail"
              accept="image/*"
              onChange={handleChangeFile}
              onBlur={handleBlur}
              touched={touched["thumbnail"]}
              touched_check={touched.thumbnail}
              errors={errors.thumbnail}
              placeholder="Attache Cover (Image only)"
              file={values.thumbnail}
            />
          </div>
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
      <ModalAlert modal={modalState} setModal={setModal} />
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        show={cover.show}
        backdrop="static"
        keyboard={false}
        onHide={() => setCover({ ...cover, show: false })}
        centered
      >
        <Modal.Body id="custom">
          {values.thumbnail && (
            <center>
              <ImageCropper
                getBlob={getBlob}
                inputImg={cover.image}
                aspect={7 / 11}
                shape="rect"
                size={{ width: 267, height: 356 }}
                resize={{ width: 350, height: 525 }}
              />
              <br />
            </center>
          )}
          <div class="d-flex flex-row justify-content-center mb-3">
            <button
              className="btn btn-danger mt-1"
              onClick={() => setCover({ ...cover, show: false })}
              style={{ background: "#AF2E1C", width: 300 }}
            >
              Save Change
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
