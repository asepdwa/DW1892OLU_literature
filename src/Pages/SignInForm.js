import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { LoginContext } from "../Context/Login";
import { API, setAuthToken } from "../Config/Api";

export default function SignIn(props) {
  // eslint-disable-next-line
  const [state, dispatch] = useContext(LoginContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await API.post("/signin", body, config);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data.data,
      });

      setAuthToken(res.data.data.token);
      alert(res.data.message);
      history.push("/Home")

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

    } catch (err) {
      alert(err.response.data.error.message)
      dispatch({
        type: "LOGIN_FAILED",
      });
    }
  };

  return (
    <Form
      style={{
        padding: 10,
        paddingTop: 20,
        paddingBottom: 30,
        borderRadius: 10,
      }}
      onSubmit={(e) => handleSubmit(e)}
    >
      <Form.Group>
        <h3 className="FormTitle">Sign In</h3>
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e) => handleChange(e)}
        />
      </Form.Group>
      <Form.Group controlId="formBasicPassword" style={{ paddingBottom: 15 }}>
        <Form.Control
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => handleChange(e)}
        />
      </Form.Group>
      <Button
        variant="danger"
        type="submit"
        style={{ width: "100%", background: "#EE4622" }}
      >
        Sign In
        </Button>
      <p className="modalFooter">
        Don't have an account ? <b onClick={props.Modal}>Click Here</b>
      </p>
    </Form>
  );
}
