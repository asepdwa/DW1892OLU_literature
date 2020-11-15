import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalAlert(props) {
  const { modal, setModal } = props;

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={modal.show}
      onHide={() => setModal({ ...modal, show: false })}
    >
      <div
        className={`alert ${modal.alertType}`}
        style={{ margin: 10, textAlign: "center" }}
      >
        <h4>{modal.message}</h4>
      </div>
    </Modal>
  );
}
