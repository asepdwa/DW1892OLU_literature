import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { FaExclamationTriangle } from "react-icons/fa";

import { API, setAuthToken } from "../Config/Api";
import { LoginContext } from "../Context/Login";

import {
  CustomInput,
  CustomInputPassword,
  CustomSelect,
} from "../Component/CustomForm";
import LoadingScreen from "../Component/LoadingScreen";

import { useFormik } from "formik";
import * as yup from "yup";

export default function SignUpForm(props) {
  const history = useHistory();

  // eslint-disable-next-line
  const [state, dispatch] = useContext(LoginContext);
  const [message, setMessage] = useState({
    error: false,
    fill: "",
  });

  const { handleSubmit, getFieldProps, errors, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
      gender: "",
      phone: "",
      address: "",
      role: "Guest",
    },

    validationSchema: yup.object({
      email: yup.string().required().min(6).email(),
      password: yup.string().required().min(6),
      fullName: yup.string().required().min(3),
      phone: yup.number().required().min(6),
      gender: yup.string().required(),
      address: yup.string().required().min(10),
    }),

    onSubmit: (values) => {
      handleSignUp(values);
    },
  });

  const [handleSignUp, { isLoading, error }] = useMutation(async (values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = values;
      const res = await API.post("/signup", body, config);

      setMessage({ error: false, fill: res.data.message });
      setAuthToken(res.data.data.token);

      try {
        const resAuth = await API.get("/auth");
        dispatch({
          type: "LOAD_USER",
          payload: resAuth.data.data,
        });
        history.push("/Home");
      } catch (err) {
        dispatch({
          type: "AUTH_ERROR",
        });
      }
    } catch (err) {
      console.log(err);
      setMessage({ error: true, fill: err.response.data.error.message });
    }
  });

  return (
    <form
      style={{
        padding: 10,
        paddingTop: 20,
        paddingBottom: 30,
      }}
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <h3 className="FormTitle">Sign Up</h3>
      </div>
      {(message.fill !== "" || error) && (
        <div
          className={
            message.error || error
              ? "alert alert-danger"
              : "alert alert-success"
          }
        >
          <center>
            {(message.error || error) && <FaExclamationTriangle size={25} />}{" "}
            <b>{message.fill || error}</b>
          </center>
        </div>
      )}
      <CustomInput
        type="email"
        name="email"
        placeholder="Email"
        {...getFieldProps("email")}
        error={touched.email ? errors.email : ""}
      />
      <CustomInputPassword
        name="password"
        placeholder="Password"
        {...getFieldProps("password")}
        error={touched.password ? errors.password : ""}
      />
      <CustomInput
        type="text"
        name="fullName"
        placeholder="Name"
        {...getFieldProps("fullName")}
        error={touched.fullName ? errors.fullName : ""}
      />
      <CustomSelect
        type="text"
        name="gender"
        {...getFieldProps("gender")}
        error={touched.gender ? errors.gender : ""}
      >
        <option>Select your gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </CustomSelect>
      <CustomInput
        type="text"
        name="phone"
        placeholder="Phone"
        {...getFieldProps("phone")}
        error={touched.phone ? errors.phone : ""}
      />
      <CustomInput
        type="text"
        name="address"
        placeholder="Address"
        {...getFieldProps("address")}
        error={touched.address ? errors.address : ""}
      />
      {isLoading ? (
        <LoadingScreen size="2.5rem" />
      ) : (
        <button
          className="btn btn-danger"
          type="submit"
          style={{ width: "100%", background: "#af2e1c" }}
        >
          Sign Up
        </button>
      )}
      <p className="modalFooter">
        Already have an account ? <b onClick={props.Modal}>Click Here</b>
      </p>
    </form>
  );
}
