import React, { createContext, useReducer } from "react";
export const LoginContext = createContext();
const initialState = {
  isLogin: false,
  userData: null,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isLogin: true,
        loading: true,
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        isLogin: false,
        userData: null,
        loading: false,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        isLogin: false,
        userData: null,
      }
    case "LOAD_USER":
      return {
        ...state,
        isLogin: true,
        userData: action.payload,
        loading: false,
      };
    case "REGISTER":
      return {
        ...state,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        isLogin: false,
        userData: null,
        loading: false,
        isLoading: true,
      };
    default:
      throw new Error();
  }
};

export default function LoginContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LoginContext.Provider value={[state, dispatch]}>
      {props.children}
    </LoginContext.Provider>
  );
}