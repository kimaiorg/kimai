import axios from "axios";

const proxyPath = "/proxy";

const removeTokens = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("backend-at-token");
};

const projectAxios = axios.create({
  baseURL: process.env.API_GATEWAY_URL + proxyPath,
  validateStatus: () => true
});
// Add a request interceptor
projectAxios.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["x-service-name"] = "project";
  return config;
});
// Add a response interceptor
projectAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401) {
      removeTokens();
    }
    return Promise.reject(error);
  }
);
const timesheetAxios = axios.create({
  baseURL: process.env.API_GATEWAY_URL + proxyPath,
  validateStatus: () => true
});
// Add a request interceptor
timesheetAxios.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["x-service-name"] = "timesheet";
  return config;
});
// Add a response interceptor
timesheetAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401) {
      removeTokens();
    }
    return Promise.reject(error);
  }
);

const invoiceAxios = axios.create({
  baseURL: process.env.INVOICE_BACKEND_URL,
  validateStatus: () => true
});
// Add a request interceptor
invoiceAxios.interceptors.request.use((config) => config);
// Add a response interceptor
invoiceAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401) {
      removeTokens();
    }
    return Promise.reject(error);
  }
);
const notificationAxios = axios.create({
  baseURL: process.env.API_GATEWAY_URL + proxyPath,
  validateStatus: () => true
});
// Add a request interceptor
notificationAxios.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["x-service-name"] = "notification";
  return config;
});
// Add a response interceptor
notificationAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401) {
      removeTokens();
    }
    return Promise.reject(error);
  }
);
const reportAxios = axios.create({
  baseURL: process.env.REPORTING_BACKEND_URL,
  validateStatus: () => true
});
// Add a request interceptor
reportAxios.interceptors.request.use((config) => config);
// Add a response interceptor
reportAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401) {
      removeTokens();
    }
    return Promise.reject(error);
  }
);

export { invoiceAxios, notificationAxios, projectAxios, removeTokens, reportAxios, timesheetAxios };
