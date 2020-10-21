import axios from "axios";

export const baseURL = "http://localhost:5000/api/v1";
export const ebookFolder = "http://localhost:5000/ebook/";
export const thumbnailFolder = "http://localhost:5000/thumbnail/";
export const API = axios.create({
    baseURL,
});

export function setAuthToken(token) {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common["Authorization"];
    }
};