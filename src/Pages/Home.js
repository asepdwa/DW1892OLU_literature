import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BiChevronDownCircle } from "react-icons/bi";
import { Accordion, Card } from "react-bootstrap";
import ListLiterature from "../Component/ListLiterature";

export default function Home() {
  const [searchData, setSearchData] = useState({
    keyword: "",
    from: "",
    to: "",
    submitted_keyword: "",
    submitted_from: "",
    submitted_to: "",
    submit: false,
  });

  return (
    <div className="container-fluid text-white mt-5 mb-4">
      {!searchData.submit ? (
        <center>
          <br />
          <img
            src="logo.png"
            alt="icon"
            style={{ marginBottom: 10, width: 400, height: "auto" }}
          />
          <br />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchData({
                ...searchData,
                submit: true,
                submitted_keyword: searchData.keyword,
                year: "",
              });
            }}
          >
            <div
              className="d-flex justify-content-center"
              style={{ margin: "auto", display: "block" }}
            >
              <div className="p-2">
                <input
                  placeholder="Search for literature"
                  className="form-control"
                  id="custom-input"
                  onChange={(e) =>
                    setSearchData({ ...searchData, keyword: e.target.value })
                  }
                  style={{ width: 400 }}
                  value={searchData.keyword}
                  type="text"
                />
              </div>
              <div className="p-2">
                <button
                  className="btn btn-danger"
                  style={{ background: "#af2e1c" }}
                >
                  <FaSearch size="22" />
                </button>
              </div>
            </div>
          </form>
        </center>
      ) : (
        <div className="container-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchData({
                ...searchData,
                submitted_keyword: searchData.keyword,
                submitted_from: searchData.from,
                submitted_to: searchData.to,
              });
            }}
          >
            <div
              className="d-flex justify-content-start mb-3"
              style={{ marginLeft: -10 }}
            >
              <div className="d-flex align-items-start">
                <input
                  placeholder="Search for literature"
                  className="form-control"
                  id="custom-input"
                  style={{
                    width: 375,
                    background: `rgba(${"210, 210, 210, 0.25"})`,
                    color: "white",
                    marginRight: 10,
                  }}
                  onChange={(e) =>
                    setSearchData({ ...searchData, keyword: e.target.value })
                  }
                  value={searchData.keyword}
                  type="text"
                />
                <button
                  className="btn btn-danger"
                  style={{ background: "#af2e1c" }}
                >
                  <FaSearch size="22" />
                </button>
              </div>
            </div>
          </form>
          <div className="row">
            <div className="col-sm-2">
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {searchData.submitted_from === "" &&
                searchData.submitted_to === ""
                  ? "Anytime"
                  : searchData.submitted_from + " - " + searchData.submitted_to}
              </p>
              <Accordion>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Filter <BiChevronDownCircle size="20px" />
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <p style={{ textAlign: "center" }}>Year Publication</p>
                      <div className="row" style={{ padding: 0 }}>
                        <div className="col">
                          <input
                            className="form-control form-control-sm"
                            type="number"
                            name="from"
                            id="custom-input"
                            value={searchData.from}
                            onChange={(e) =>
                              setSearchData({
                                ...searchData,
                                from: e.target.value,
                              })
                            }
                          />
                        </div>
                        <center>
                          <small>to</small>
                        </center>
                        <div className="col">
                          <input
                            className="form-control form-control-sm"
                            type="number"
                            name="to"
                            id="custom-input"
                            value={searchData.to}
                            onChange={(e) =>
                              setSearchData({
                                ...searchData,
                                to: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>

            <div className="col-10">
              <ListLiterature
                query={`getLiteraturesQ=${searchData.submitted_keyword}`}
                status="Approved"
                from={searchData.submitted_from}
                to={searchData.submitted_to}
                searchKeyword={searchData.submitted_keyword}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
