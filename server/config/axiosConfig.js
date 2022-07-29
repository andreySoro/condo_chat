const axios = require("axios");
require("dotenv").config();

const axiosConfig = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

axiosConfig.interceptors.request.use(async (request) => {
  const requestConfig = { ...request };
  //   requestConfig.headers.common.Authorization = `Bearer ${auth_token}`;

  return requestConfig;
});

module.exports = axiosConfig;
