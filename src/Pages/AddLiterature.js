import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import { BiBookAdd } from "react-icons/bi";

import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";

import { CustomInput, CustomInputFile } from "../Component/CustomForm";
import LoadingScreen from "../Component/LoadingScreen";
import ModalAlert from "../Component/ModalAlert";

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
      body.append("thumbnail", value.thumbnail);
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
          placeholder="Author Name, Ex: Irwanto Wibowo"
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
    </div>
  );
}
