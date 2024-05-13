/* Node Modules */
import axios from "axios";
import { BE_URL } from "../constants/network";

const networkAdapter = axios.create({
  baseURL: BE_URL,
});

networkAdapter.defaults.timeout = 5000;

networkAdapter.interceptors.request.use(function (config) {
  let token = localStorage.getItem("zenfitx-access-token");
  token = JSON.parse(token as string);

  config.headers["x-wellness-jwt"] = token;

  return config;
});

networkAdapter.interceptors.response.use(function (response) {
  return response;
});

export default networkAdapter;
