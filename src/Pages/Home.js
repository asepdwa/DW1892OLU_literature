import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ListLiterature from "../Component/ListLiterature";

export default function Home() {
  const [searchData, setSearchData] = useState({
    keyword: "",
    year: "",
    fetch_keyword: "",
    submit: false,
  });

  return (
    <div className="container-fluid text-white mt-3 mb-4">
      {!searchData.submit ? <center>
        <br />
        <h3 className="mt-4" style={{
          fontFamily: "Times New Roman",
          fontSize: 65,
          fontStyle: "italic",
          fontWeight: 700,
        }}>literature
      <img style={{ marginLeft: -12, marginTop: -32, width: 110, height: 110 }} src="quill-drawing-a-line.png" alt="icon" />
          <br />
        </h3><form onSubmit={(e) => {
          e.preventDefault();
          setSearchData({ ...searchData, submit: true, fetch_keyword: searchData.keyword });
        }}>
          <div className="d-flex justify-content-center" style={{ margin: "auto", display: "block" }}>
            <div className="p-2">
              <input
                placeholder="Search for literature"
                className="form-control"
                style={{ width: 420, background: `rgba(${"210, 210, 210, 0.25"})`, color: "white" }}
                onChange={(e) => setSearchData({ keyword: e.target.value })}
                value={searchData.keyword}
                type="text" />
            </div>
            <div className="p-2">
              <button className="btn btn-danger" style={{ background: "#af2e1c" }}>
                <FaSearch size="22" /></button>
            </div>
          </div>
        </form>
      </center> : (
          <div className="container-xl">
            <form onSubmit={(e) => {
              e.preventDefault();
              setSearchData({ ...searchData, fetch_keyword: searchData.keyword });
            }}>
              <div className="d-flex justify-content-start mb-3" style={{ margin: "auto", display: "block" }}>
                <div className="p-2">
                  <input
                    placeholder="Search for literature"
                    className="form-control"
                    style={{ width: 375, background: `rgba(${"210, 210, 210, 0.25"})`, color: "white" }}
                    onChange={(e) => setSearchData({ ...searchData, keyword: e.target.value })}
                    value={searchData.keyword}
                    type="text" />
                </div>
                <div className="p-2">
                  <button className="btn btn-danger" style={{ background: "#af2e1c" }}>
                    <FaSearch size="22" /></button>
                </div>
              </div>
            </form>
            <div className="row">
              <div className="col-2" style={{ paddingLeft: 25 }}>
                <select
                  className="form-control"
                  style={{ width: 100, background: `rgba(${"210, 210, 210, 0.25"})`, color: "white" }}
                  type="text"
                  onChange={(e) => setSearchData({ ...searchData, year: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="2017">2017</option>
                  <option value="2018">2018</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                </select></div>

              <div className="col-10">
                <ListLiterature Year={searchData.year} searchKeyword={searchData.fetch_keyword} />
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
