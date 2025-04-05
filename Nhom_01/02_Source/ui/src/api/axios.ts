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
  (error) => Promise.reject(error)
  // async (error) => {
  //     const errorResponse = error.response.data as ErrorResponseType;
  //     if (errorResponse.statusCode === 401) {
  //         if (errorResponse.errorCode == "at_token_expired") {
  //             console.log("Auto call renew token");
  //             const result = await callRenewTokenRequest();
  //             if (Object.keys(result).includes("accessToken")) {
  //                 const { accessToken, refreshToken } = result as RenewTokensType;
  //                 localStorage.setItem("accessToken", accessToken);
  //                 localStorage.setItem("refreshToken", refreshToken);
  //             } else {
  //                 localStorage.removeItem("accessToken");
  //                 localStorage.removeItem("refreshToken");
  //             }
  //         } else {
  //             localStorage.removeItem("accessToken");
  //             localStorage.removeItem("refreshToken");
  //         }
  //     }
  //     return Promise.reject(error);
  // }
);

export { myAxios };
