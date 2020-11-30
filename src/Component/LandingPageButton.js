import React, { useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import SignInForm from "../Pages/SignInForm";
import SignUpForm from "../Pages/SignUpForm";
import { LoginContext } from "../Context/Login";

export default function LpButton() {
  const [state] = useContext(LoginContext);
  const history = useHistory();

  const [modal, setModal] = useState({
    signIn: false,
    signUp: false,
  });

  const handleSignUp = () => setModal({ signIn: false, signUp: true });
  const handleSignIn = () => setModal({ signIn: true, signUp: false });
  const handleHide = () => setModal({ signIn: false, signUp: false });

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
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
      <Button
        variant="light"
        style={{ width: 211, marginRight: 10, fontWeight: 600 }}
        onClick={handleSignIn}
      >
        Sign In
      </Button>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modal.signIn}
        onHide={handleHide}
      >
        <Modal.Body id="custom">
          <SignInForm Modal={handleSignUp} />
        </Modal.Body>
      </Modal>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modal.signUp}
        onHide={handleHide}
      >
        <Modal.Body id="custom">
          <SignUpForm Modal={handleSignIn} />
        </Modal.Body>
      </Modal>
    </>
  );
}
