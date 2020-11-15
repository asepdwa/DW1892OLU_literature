import React, { useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import SignInForm from "../Pages/SignInForm";
import SignUpForm from "../Pages/SignUpForm";
import { LoginContext } from "../Context/Login";

export default function LpButton() {
  const [state] = useContext(LoginContext);
  const history = useHistory();

  const [SignUp, setSignUp] = useState(false);
  const [SignIn, setSignIn] = useState(false);

  const handleSignUp = () => {
    setSignUp(true);
    setSignIn(false);
  };

  const handleSignIn = () => {
    setSignUp(false);
    setSignIn(true);
  };

  return state.isLogin ? (
    <Button
      variant="light"
      style={{ width: 400, marginRight: 10, marginBottom: 2 }}
      onClick={() => history.push("/Home")}
    >
      Home
    </Button>
  ) : (
    <>
      <Button
        variant="danger"
        style={{
          width: 211,
          marginRight: 10,
          background: "#AF2E1C",
          marginBottom: 2,
          fontWeight: 600,
        }}
        onClick={() => setSignUp(true)}
      >
        Sign Up
      </Button>
      <Button
        variant="light"
        style={{ width: 211, marginRight: 10, fontWeight: 600 }}
        onClick={() => setSignIn(true)}
      >
        Sign In
      </Button>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={SignIn}
        onHide={() => setSignIn(false)}
      >
        <Modal.Body id="custom">
          <SignInForm Modal={handleSignUp} />
        </Modal.Body>
      </Modal>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={SignUp}
        onHide={() => setSignUp(false)}
      >
        <Modal.Body id="custom">
          <SignUpForm Modal={handleSignIn} />
        </Modal.Body>
      </Modal>
    </>
  );
}
