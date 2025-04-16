import axios from "axios";

const myAxios = axios.create({
  baseURL: process.env.BACKEND_URL,
  validateStatus: () => true
});
// Add a request interceptor
myAxios.interceptors.request.use((config) => config);
// Add a response interceptor
myAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("backend-at-token");
    }
    return Promise.reject(error);
  }
);

export { myAxios };
