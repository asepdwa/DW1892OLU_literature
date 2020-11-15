import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { useMutation } from "react-query";

import { LoginContext } from "../Context/Login";
import { API, setAuthToken } from "../Config/Api";
import { CustomInput, CustomInputPassword } from "../Component/CustomForm";
import LoadingScreen from "../Component/LoadingScreen";

import { useFormik } from "formik";
import * as yup from "yup";

export default function SignIn(props) {
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
    },

    validationSchema: yup.object({
      email: yup.string().required().min(6).email(),
      password: yup.string().required().min(6),
    }),

    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const history = useHistory();
  const [handleLogin, { isLoading, error }] = useMutation(async (values) => {
    try {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const body = values;
        const res = await API.post("/signin", body, config);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: res.data.data,
        });

        setMessage({ error: false, fill: res.data.message });
        setAuthToken(res.data.data.token);

        try {
          const resAuth = await API.get("/auth");
          dispatch({
            type: "LOAD_USER",
            payload: resAuth.data.data,
          });
        } catch (err) {
          dispatch({
            type: "AUTH_ERROR",
          });
        }

        history.push("/Home");
      } catch (err) {
        dispatch({
          type: "LOGIN_FAILED",
        });
        setMessage({ error: true, fill: err.response.data.error.message });
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
      <div className="form-group">
        <h3 className="FormTitle">Sign In</h3>
      </div>
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
      {isLoading ? (
        <LoadingScreen size="2.5rem" />
      ) : (
        <button
          className="btn btn-danger"
          type="submit"
          style={{ width: "100%", background: "#af2e1c" }}
        >
          Sign In
        </button>
      )}

      <p className="modalFooter">
        Don't have an account ? <b onClick={props.Modal}>Click Here</b>
      </p>
    </form>
  );
}
