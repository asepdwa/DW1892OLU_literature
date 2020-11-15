import React, { useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";

import { API } from "../Config/Api";
import { LoginContext } from "../Context/Login";

import LoadingScreen from "./LoadingScreen";
import ModalConfirm from "./ModalConfirm";
import ModalAlert from "./ModalAlert";
import Literature from "./Literature";

export default function ListLiterature(props) {
  const [state] = useContext(LoginContext);
  const {
    collection,
    from,
    to,
    searchKeyword,
    status,
    uploader,
    sort,
    order,
  } = props;

  const { loading, error, data: literatures, refetch } = useQuery(
    `getLiteraturesData`,
    async () =>
      await API.get(
        `/literatures?from=${from || ""}&to=${to || ""}&q=${
          searchKeyword || ""
        }&status=${status || ""}&uploader=${uploader || ""}&sort=${
          sort || ""
        }&order=${order || ""}`
      )
  );

  useEffect(() => {
    refetch();
  }, [from, to, searchKeyword, sort, order, status, uploader]); // eslint-disable-line react-hooks/exhaustive-deps

  const [modalConfirmState, setModalConfirm] = useState({
    show: false,
    message: "",
    actionId: null,
  });

  const [modalAlertState, setModalAlert] = useState({
    show: false,
    message: "",
    alertType: "alert-success",
  });

  const handleDeleteConfirm = (id) => {
    setModalConfirm({
      show: true,
      message: "Are you sure want delete? ",
      actionParams: { id },
    });
  };

  const [handleDelete, { loading: deleteLoading }] = useMutation(
    async (params) => {
      try {
        const res = await API.delete(`/literature/${params.id}`);

        setModalConfirm({
          ...modalConfirmState,
          show: false,
        });

        setModalAlert({
          show: true,
          message: res.data.message,
          alertType: "alert-success",
        });

        refetch();
      } catch (error) {
        setModalConfirm({
          ...modalConfirmState,
          show: false,
        });

        setModalAlert({
          show: true,
          message: error.response.message,
          alertType: "alert-danger",
        });
      }
    }
  );

  if (loading || !literatures) {
    return error ? <h1>error {error.message} </h1> : <LoadingScreen />;
  } else {
    let datas = !collection
      ? literatures.data.data
      : state.userData.collections_data;

    return (
      <div className="row mt-4">
        {datas.length > 0 ? (
          datas.map((literature, index) => (
            <Literature
              literature={literature}
              index={index}
              refetch={refetch}
              profile={uploader ? true : false}
              handleDelete={handleDeleteConfirm}
            />
          ))
        ) : (
          <div
            style={{ width: "95%", margin: "auto", display: "block" }}
            className="alert alert-danger"
            role="alert"
          >
            <h4 className="alert-heading" style={{ textAlign: "center" }}>
              {searchKeyword
                ? `Result: ${searchKeyword} Not found`
                : collection
                ? "You don't have literature that added to your collection"
                : uploader
                ? "You don't have any literature"
                : "Literature is not found"}
            </h4>
          </div>
        )}
        <ModalAlert modal={modalAlertState} setModal={setModalAlert} />
        <ModalConfirm
          modal={modalConfirmState}
          setModal={setModalConfirm}
          action={handleDelete}
          loadingAction={deleteLoading}
        />
      </div>
    );
  }
}
