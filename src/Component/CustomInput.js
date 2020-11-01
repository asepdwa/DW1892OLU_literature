import React from "react";

export default function CustomInput(props) {
  return (
    <div className="form-group" style={{ marginTop: 20 }}>
      <input
        id="custom-input"
        className={
          props.value
            ? props.error
              ? "form-control is-invalid"
              : "form-control is-valid"
            : "form-control"
        }
        style={props.style}
        {...props}
      />
      <span className="help-block text-danger">{props.error}</span>
    </div>
  );
}

export function CustomSelect(props) {
  return (
    <div className="form-group" id="custom-input" style={{ marginTop: 20 }}>
      <select
        id="custom-input"
        className={
          props.value
            ? props.error
              ? "form-control is-invalid"
              : "form-control is-valid"
            : "form-control"
        }
        style={props.style}
        {...props}
      />
      <span className="help-block text-danger">{props.error}</span>
    </div>
  );
}
