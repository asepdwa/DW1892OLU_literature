import React, { useContext, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { FaTransgender, FaPhoneAlt, FaLink } from "react-icons/fa";
import { ImLocation } from "react-icons/im";
import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";
import ListLiterature from "../Component/ListLiterature";

export default function Profile() {
  const [state, dispatch] = useContext(LoginContext);
  const [avatarModal, setAvatarModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [formUpload, setFormUpload] = useState(true);

  const handleChange = (e) => {
    e.target.type === "file"
      ? setAvatar(e.target.files[0])
      : setAvatar(e.target.value);
  };

  const changeAvatar = async () => {
    if (!avatar) return alert("Select an Image file to change");

    try {
      if (formUpload) {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        let body = new FormData();
        body.append("avatar", avatar);

        const res = await API.patch(`/avatar`, body, config);
        alert(res.data.message);
      } else {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const body = JSON.stringify({ photoUrl: avatar });
        const res = await API.patch(`/user/${state.userData.id}`, body, config);
        alert(res.data.message);
      }

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
          <div className="col-sm-8" style={{ paddingLeft: 30 }}>
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
          <div className="col-sm-4">
            <img
              src={state.userData.photoUrl}
              alt={state.userData.fullName}
              style={{
                width: "60%",
                height: "auto",
                margin: "auto",
                display: "block",
                borderRadius: "10%",
              }}
            />
            <button className="btn-custom" onClick={() => setAvatarModal(true)}>
              Change Photo Profile
            </button>
            <Modal
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={avatarModal}
              onHide={() => setAvatarModal(false)}
            >
              <Modal.Body id="custom">
                <div className="row">
                  <div className="col-sm-8">
                    <div className="row">
                      <div className="col-9">
                        <div className="form-group">
                          {formUpload ? (
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
                      </div>
                      <div className="col-2" style={{ marginRight: 20 }}>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            setAvatar(null);
                            setFormUpload(formUpload ? false : true);
                          }}
                          style={{ background: "#AF2E1C" }}
                        >
                          {formUpload ? (
                            <FaLink size="22" />
                          ) : (
                            <FaRegFileImage size="22" />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      className="btn btn-danger btn-block mt-1 mb-4"
                      onClick={() => changeAvatar()}
                      style={{ background: "#AF2E1C" }}
                    >
                      Change Photo Profile
                    </button>
                  </div>
                  <div className="col-sm-4">
                    <img
                      src={
                        avatar
                          ? formUpload
                            ? URL.createObjectURL(avatar)
                            : avatar
                          : state.userData.photoUrl
                      }
                      alt="Enter Valid Url"
                      style={{
                        width: "100%",
                        height: "auto",
                        float: "right",
                      }}
                    />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
      <h4 className="list-title mt-4">My Literature</h4>
      <ListLiterature query="literatures" uploader={state.userData.id} />
    </div>
  );
}
