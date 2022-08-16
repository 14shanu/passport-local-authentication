import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
// initial state
const intialState = {
  user: null,
};
// create context
const Context = createContext();

// root reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, intialState);
  const router = useRouter();
  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(localStorage.getItem("user")),
    });
  }, []);

  axios.interceptors.response.use(
    function (response) {
      // any status code that lie within the range of 2XX cause this function
      // to trigger
      return response;
    },
    function (error) {
      // any status codes that falls outside the range of 2xx cause this function
      // to trigger
      let res = error.response;
      if (res.status === 403 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get("expressapi/logout")
            .then((data) => {
              console.log("/401 error > logout");

              localStorage.removeItem("user");

              dispatch({
                type: "LOGOUT",
              });
              router.push("/login");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERR", err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/expressapi/csrf-token");
      console.log("CSRF :", data);
      axios.defaults.headers["X-CSRF-TOKEN"] = data.getCsrfToken;
    };
    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
export { Context, Provider };
