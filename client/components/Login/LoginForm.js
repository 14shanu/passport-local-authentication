import React, { useState, useContext, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import Link from "next/link";
import { SyncOutlined } from "@ant-design/icons";
import { Context } from "../../context";

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const { dispatch } = useContext(Context);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/expressapi/login", values);

      setLoading(false);
      dispatch({
        type: "LOGIN",
        payload: data.user,
      });
      //Save In LocalStorage

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.current.show({
        severity: "info",
        detail: error.response.data.message,
        life: 3000,
      });
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email Format").required("Required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Toast ref={toast} onHide={() => router.push("/")} />
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-gray-200 px-6 py-14 rounded shadow-md text-black w-full">
              <div className="flex-1 flex flex-col items-center justify-center">
                <img
                  src="https://veneratesolutions.com/wp-content/uploads/2021/03/Venerate-Medium-768x208.png"
                  width="140"
                />
                {/* <Typography.Title level={3}>Welcome to Supabase Auth</Typography.Title> */}
              </div>

              <h1 className="mb-8 text-3xl text-center">Login</h1>

              <input
                type="email"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="email"
                placeholder="Email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}

              <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="password"
                placeholder="Password (5 characters and above)"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
              <div className="text-grey-dark mb-3 text-right">
                <Link href="/user/forgotpassword">
                  <a className="no-underline  text-gray-700">
                    Forgot Password ?
                  </a>
                </Link>
              </div>

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-gray-600 text-white hover:bg-gray-700 focus:outline-none my-1"
              >
                {loading ? <SyncOutlined spin /> : "Login"}
              </button>

              {/* <div className="text-grey-dark text-center">
              <Link href="/register">
                <a className="no-underline  text-gray-700">
                  Register
                </a>
              </Link>
            </div> */}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
