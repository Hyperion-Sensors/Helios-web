import axios from "axios";
let addr = process.env.NEXT_PUBLIC_SERVER_ADDR; //this is the main server address
const helios_server = axios.create({
  // Axios client for
  baseURL: `${addr}/helios-server/`, //server address must not end in a slash
  timeout: 2000,
});

export const download_server = axios.create({
  //another instance of helios-server with higher time allowance for downloads
  // Axios client for
  baseURL: `${addr}/helios-server/`,
  timeout: 10000,
});

export default helios_server;
