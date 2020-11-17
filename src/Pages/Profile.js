import React, { useContext, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { FaTransgender, FaPhoneAlt, FaLink } from "react-icons/fa";
import { ImLocation } from "react-icons/im";

import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";
import ListLiterature from "../Component/ListLiterature";
import ImageCropper from "../Component/Cropper";

export default function Profile() {
  const [state, dispatch] = useContext(LoginContext);
  const [avatar, setAvatar] = useState({
    file: null,
    blob: null,
    upload: true,
    modal: false,
  });

  const handleChange = (e) => {
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      e.target.files[0].type.match("image")
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          setAvatar({
            ...avatar,
            file: reader.result,
          });
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setAvatar({ ...avatar, file: e.target.value });
    }
  };

  const getBlob = (blob) => {
    setAvatar({ ...avatar, blob });
  };

  const changeAvatar = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      let body = new FormData();
      body.append("avatar", avatar.blob);

      const res = await API.patch(`/avatar`, body, config);
      alert(res.data.message);

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
      console.log(err);
      alert(err.response.data.error.message);
    }
  };

  return (
    <div className="container-xl text-white mt-4 mb-4">
      <div className="ProfileBox">
        <div className="row">
          <div className="col-8" style={{ paddingLeft: 30 }}>
            <div className="Profilee">
              <MdEmail
                size="30"
                fill="white"
                style={{
                  marginTop: 10,
                  filter: `drop-shadow(${"3px 3px #AF2E1C"})`,
                }}
              />
              <div className="ProfileRow">
                <p className="profile-data">{state.userData.email}</p>
                <p className="profile-note">E-mail</p>
              </div>
            </div>
            <div className="Profilee">
              <FaTransgender
                size="30"
                fill="white"
                style={{
                  marginTop: 10,
                  filter: `drop-shadow(${"3px 3px #AF2E1C"})`,
                }}
              />
              <div className="ProfileRow">
                <p className="profile-data">{state.userData.gender}</p>
                <p className="profile-note">Gender</p>
              </div>
            </div>
            <div className="Profilee">
              <FaPhoneAlt
                size="30"
                fill="white"
                style={{
                  marginTop: 10,
                  filter: `drop-shadow(${"3px 3px #AF2E1C"})`,
                }}
              />
              <div className="ProfileRow">
                <p className="profile-data">{state.userData.phone}</p>
                <p className="profile-note">Phone</p>
              </div>
            </div>
            <div className="Profilee">
              <ImLocation
                size="30"
                fill="white"
                style={{
                  marginTop: 10,
                  filter: `drop-shadow(${"3px 3px #AF2E1C"})`,
                }}
              />
              <div className="ProfileRow">
                <p className="profile-data">{state.userData.address}</p>
                <p className="profile-note">Address</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="float-right" style={{ marginRight: 30 }}>
              <img
                src={state.userData.photoUrl}
                alt={state.userData.fullName}
                style={{
                  width: 200,
                  height: "auto",
                  margin: "auto",
                  borderRadius: "100%",
                }}
              />
              <button
                className="btn-custom"
                style={{ width: 200 }}
                onClick={() =>
                  setAvatar({
                    file: null,
                    blob: null,
                    upload: true,
                    modal: true,
                  })
                }
              >
                Change Photo Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <h4 className="list-title mt-4">My Literature</h4>
      <ListLiterature
        query={`getLiteraturesByUploader?uploader=${state.userData.id}`}
        uploader={state.userData.id}
      />
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        show={avatar.modal}
        onHide={() => setAvatar({ ...avatar, modal: false })}
        centered
      >
        <Modal.Body id="custom">
          {avatar.file && (
            <center>
              <ImageCropper
                getBlob={getBlob}
                inputImg={avatar.file}
                aspect={1}
                shape="round"
                size={{ width: 350, height: 350 }}
                resize={{ width: 200, height: 200 }}
              />
              <br />
            </center>
          )}
          <div class="d-flex flex-row justify-content-center mb-1">
            <div class="p-2 flex-fill bd-highlight">
              {avatar.upload ? (
                <>
                  <input
                    type="file"
                    className="form-control-file"
                    name="avatar"
                    id="avatar"
                    accept="image/*"
                    onChange={(e) => handleChange(e)}
                    style={{ display: "none" }}
                  />
                  <label
                    for="avatar"
                    className="btn btn-danger btn-block"
                    style={{ background: "#AF2E1C" }}
                  >
                    Attache Photo Profile
                  </label>
                </>
              ) : (
                <input
                  className="form-control"
                  type="text"
                  name="avatar"
                  id="avatar"
                  placeholder="Enter photo profile URL"
                  onChange={(e) => handleChange(e)}
                />
              )}
            </div>
            <div class="p-2 bd-highlight">
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  setAvatar({ ...avatar, upload: !avatar.upload });
                }}
                style={{ background: "#AF2E1C" }}
              >
                {avatar.upload ? (
                  <FaLink size="22" />
                ) : (
                  <FaRegFileImage size="22" />
                )}
              </button>
            </div>
          </div>
          <div class="d-flex flex-row justify-content-center mb-3">
            <button
              className="btn btn-danger mt-1"
              onClick={() => changeAvatar()}
              style={{ background: "#AF2E1C", width: "95%" }}
            >
              Save Change
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
