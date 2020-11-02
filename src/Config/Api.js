import axios from "axios";

export const baseURL = "https://literatures.herokuapp.com/api/v1";
export const API = axios.create({
  baseURL,
});

export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
}
