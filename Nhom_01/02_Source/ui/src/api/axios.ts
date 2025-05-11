import axios from "axios";

const removeTokens = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("backend-at-token");
};

const projectAxios = axios.create({
  baseURL: process.env.PROJECT_BACKEND_URL,
  validateStatus: () => true
});
// Add a request interceptor
projectAxios.interceptors.request.use((config) => config);
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
  baseURL: process.env.TIMESHEET_BACKEND_URL,
  validateStatus: () => true
});
// Add a request interceptor
timesheetAxios.interceptors.request.use((config) => config);
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
  baseURL: process.env.NOTIFICATION_BACKEND_URL,
  validateStatus: () => true
});
// Add a request interceptor
notificationAxios.interceptors.request.use((config) => config);
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

export { invoiceAxios, notificationAxios, projectAxios, timesheetAxios, removeTokens };
