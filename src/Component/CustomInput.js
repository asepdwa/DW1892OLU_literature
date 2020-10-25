import React from "react";

export default function CustomInput(props) {
    return (
        <div className="form-group" style={{ marginTop: 20 }}>
            <input className={props.value ? props.error ? "form-control is-invalid" : "form-control is-valid" : "form-control"} style={props.style} {...props} />
            <span className="help-block text-danger">{props.error}</span>
        </div>
    );
};

export function CustomSelect(props) {
    return (
        <div className="form-group" style={{ marginTop: 20 }}>
            <select className={props.value ? props.error ? "form-control is-invalid" : "form-control is-valid" : "form-control"} style={props.style} {...props} />
            <span className="help-block text-danger">{props.error}</span>
        </div>
    );
};