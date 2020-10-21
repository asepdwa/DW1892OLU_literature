import React from "react";
import { ReactReader } from "react-reader";
import { Link, useParams, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../Config/Api";
import LoadingScreen from "../Component/LoadingScreen";
import icon from "../Assets/icon.png";

export default function Read() {
  const { id } = useParams();
  const history = useHistory();
  const { loading, error, data: books } = useQuery(
    "getBookData",
    async () => await API.get(`/book/${id}`)
  );

  if (loading || !books) {
    return error ? (
      <h1>error {error.message} </h1>
    ) : <LoadingScreen />;
  } else {
    let bookData = books.data.data;
    console.log(bookData.fileUrl);

    // eslint-disable-next-line
    if (id == null || id == undefined) {
      history.push("/Home");
      return <></>;
    } else {
      return (
        <div>
          <center>
            <header className="App-header mt-4">
              <p>
                <Link
                  to="/Home"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <img src={icon} alt="icon" /> Lib'rary
              </Link>
              </p>
            </header>
          </center>
          <div style={{ position: "relative", height: "100vh" }}>
            <ReactReader
              url={bookData.fileUrl}
              title={bookData.title}
              location={"epubcfi(/6/1[cover]!/6)"}
              locationChanged={(epubcfi) => console.log(epubcfi)}
            />
          </div>
        </div>
      );
    }
  }
}