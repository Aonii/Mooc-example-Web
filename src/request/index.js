import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}/api`,
  timeout: 100000,
  responseType: "json",
  responseEncoding: "utf8",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Unauthenticated!");

        window.location.href = "/login";

        return { status: 401, data: {}, message: "Unauthenticated" };
      } else {
        if (
          error.response.data &&
          error.response.data.status &&
          error.response.data.message
        ) {
          const message = error.response.data.message;

          if (Array.isArray(message)) {
            toast.error(message[0]?.msg || "Request error!");
          } else if (typeof message === "string") {
            toast.error(message);
          } else {
            toast.error("Request error!");
          }

          return { status: 400, data: {}, message: "Request error!" };
        }

        toast.error("Request error!");
        return { status: 500, data: {}, message: "Request error!" };
      }
    }

    toast.error("Unexpected error!");
    return { status: 500, data: {}, message: "Unexpected error!" };
  }
);

export default instance;
