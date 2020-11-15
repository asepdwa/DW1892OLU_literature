import React from "react";
import { Modal } from "react-bootstrap";
import LoadingScreen from "./LoadingScreen";

export default function ModalConfirm(props) {
  const { modal, setModal, action, loadingAction } = props;
  const handleClose = () => setModal({ ...modal, show: false });

  return (
    <>
      <Modal
        show={modal.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body id="custom">
          {modal.message}
          {loadingAction ? (
            <LoadingScreen size="2.5rem" />
          ) : (
            <div className="d-flex justify-content-end">
              <button className="btn btn-light" onClick={handleClose}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => action(modal.actionParams)}
                style={{ background: "#AF2E1C", marginLeft: 10 }}
              >
                Yes
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
