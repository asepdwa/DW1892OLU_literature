import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FcApproval } from "react-icons/fc";
import { FaTrashAlt } from "react-icons/fa";
import { useQuery, useMutation } from "react-query";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { API } from "../Config/Api";

import ModalAlert from "../Component/ModalAlert";
import ModalConfirm from "../Component/ModalConfirm";
import LoadingScreen from "../Component/LoadingScreen";

const filterDropdown = ["Approved", "Canceled", "Waiting to be verified"];
const blankLiteratureTable = [
  "1",
  "None",
  "None",
  "None",
  "None",
  <center>None</center>,
  <center>None</center>,
];

export default function Verification() {
  const [filterStatus, setFilterStatus] = useState("");
  const { isLoading, error, data: literatures, refetch } = useQuery(
    "getLiteraturesData",
    async () => await API.get(`/literatures?status=${filterStatus}`)
  );

  const [modalConfirmState, setModalConfirm] = useState({
    show: false,
    message: null,
    actionParams: null,
  });

  const [modalState, setModal] = useState({
    show: false,
    message: "",
    alertType: "alert-success",
  });

  const handleActionConfirm = ({ id, action, message, status }) => {
    setModalConfirm({
      show: true,
      message,
      actionParams: { id, action, status },
    });
  };

  const [handleAction, { isLoading: actionLoading }] = useMutation(
    async (params) => {
      try {
        const config = {
          headers: {
            "content-type": "application/json",
          },
        };

        const body = JSON.stringify({ status: params.status });
        const res =
          params.action === "patch"
            ? await API.patch(`/literature/${params.id}`, body, config)
            : await API.delete(`/literature/${params.id}`);

        setModal({
          show: true,
          message: res.data.message,
          alertType: "alert-success",
        });

        refetch();
        setModalConfirm({ ...modalConfirmState, show: false });
      } catch (error) {
        setModalConfirm({ ...modalConfirmState, show: false });
        setModal({
          show: true,
          message: error.response.data.message,
          alertType: "alert-danger",
        });
      }
    }
  );

  useEffect(() => {
    refetch();
  }, [filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !literatures) {
    return error ? <h1>error {error.message} </h1> : <LoadingScreen />;
  } else {
    let datas = literatures.data.data;

    return (
      <div className="container-xl text-white mt-4 mb-4">
        <div className="row">
          <div className="col-8">
            <h4 className="list-title">Literatures Verification</h4>
          </div>
          <div className="col-4">
            <div className="float-right">
              <DropdownButton
                variant="secondary"
                id="dropdown-basic"
                title={filterStatus === "" ? "Filter Status" : filterStatus}
              >
                <Dropdown.Header>Select filter status</Dropdown.Header>
                <Dropdown.Item
                  onClick={() => {
                    setFilterStatus("");
                  }}
                >
                  All
                </Dropdown.Item>
                {filterDropdown.map((filter, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => {
                      setFilterStatus(filter);
                    }}
                  >
                    {filter}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-striped table-md mt-4">
            <thead>
              <tr>
                <th>No</th>
                <th>Uploader</th>
                <th>ISBN</th>
                <th>E-book</th>
                <th>Status</th>
                <th>
                  <center>Action</center>
                </th>
                <th>
                  <center>Delete</center>
                </th>
              </tr>
            </thead>
            <tbody>
              {datas.length > 0 ? (
                datas.map((literature, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{literature.uploader.fullName}</td>
                    <td>{literature.isbn}</td>
                    <td style={{ fontSize: 12, fontWeight: 700 }}>
                      <Link to={`/Detail/${literature.id}`}>
                        {literature.fileUrl
                          .split("/")
                          [literature.fileUrl.split("/").length - 1].substring(
                            0,
                            40
                          )}
                      </Link>
                    </td>
                    {literature.status === "Approved" ? (
                      <>
                        <td
                          className="text-success"
                          style={{ fontSize: 12, fontWeight: 700 }}
                        >
                          {literature.status}
                        </td>
                        <td>
                          <center>
                            <FcApproval size="30" />
                          </center>
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          className={
                            literature.status === "Canceled"
                              ? "text-danger"
                              : "text-warning"
                          }
                          style={{ fontSize: 12, fontWeight: 700 }}
                        >
                          {literature.status}
                        </td>
                        <td>
                          <center>
                            {literature.status !== "Canceled" && (
                              <button
                                onClick={() =>
                                  handleActionConfirm({
                                    id: literature.id,
                                    action: "patch",
                                    status: "Canceled",
                                    message: "Are you sure want to cancel ?",
                                  })
                                }
                                className="btn btn-danger"
                              >
                                Cancel
                              </button>
                            )}{" "}
                            <button
                              onClick={() =>
                                handleActionConfirm({
                                  id: literature.id,
                                  action: "patch",
                                  status: "Approved",
                                  message: "Are you sure want to approve ?",
                                })
                              }
                              className="btn btn-success"
                            >
                              Approve
                            </button>
                          </center>
                        </td>
                      </>
                    )}
                    <td>
                      <center>
                        <button
                          onClick={() =>
                            handleActionConfirm({
                              id: literature.id,
                              action: "remove",
                              message: "Are you sure want to remove ?",
                            })
                          }
                          className="btn btn-secondary"
                        >
                          <FaTrashAlt />
                        </button>
                      </center>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {blankLiteratureTable.map((data, index) => (
                    <td>{data}</td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ModalAlert modal={modalState} setModal={setModal} />
        <ModalConfirm
          modal={modalConfirmState}
          setModal={setModalConfirm}
          action={handleAction}
          loadingAction={actionLoading}
        />
      </div>
    );
  }
}
