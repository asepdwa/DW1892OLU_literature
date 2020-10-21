import React from 'react'

export default function LoadingScreen() {
    return (
        <div className="text-center mt-4" >
            <div className="spinner-grow text-primary" style={{ width: "4rem", height: "4rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>{" "}
            <div className="spinner-grow text-secondary" style={{ width: "4rem", height: "4rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>{" "}
            <div className="spinner-grow text-success" style={{ width: "4rem", height: "4rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>{" "}
            <div className="spinner-grow text-danger" style={{ width: "4rem", height: "4rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>{" "}
            <div className="spinner-grow text-warning" style={{ width: "4rem", height: "4rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>{" "}
            <div className="spinner-grow text-info" style={{ width: "4rem", height: "4rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>{" "}
            <div className="spinner-grow text-light" style={{ width: "4rem", height: "4rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>{" "}
            <div className="spinner-grow text-dark" style={{ width: "4rem", height: "4rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div >
    )
}