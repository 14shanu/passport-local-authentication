import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik, Field } from "formik";
import axios from "axios";
// import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import { SyncOutlined } from "@ant-design/icons";
import { Toast } from "primereact/toast";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const toast = useRef(null);

  const handleSubmit = async (values, submitProps) => {
    try {
      setLoading(true);
      const { data } = await axios.patch("/expressapi/resetpassword", values);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: data.message,
        life: 3000,
      });
      setShowToast(true);
      submitProps.resetForm();
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: "info",
        detail: error.response.data.message,
        life: 3000,
      });
      setShowToast(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email Format").required("Required"),
    otp: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, "Must be exactly 6 digits")
      .max(6, "Must be exactly 6 digits"),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const checkStatus = () => {
    if (showToast) {
      router.push("/login");
    }
  };

  return (
    <>
      <Toast ref={toast} onHide={checkStatus} />
      <form onSubmit={formik.handleSubmit}>
        <div className=" bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-gray-200 px-6 py-8 rounded shadow-md text-black w-full">
              <div className="flex-1 flex flex-col items-center justify-center">
                <img
                  src="https://veneratesolutions.com/wp-content/uploads/2021/03/Venerate-Medium-768x208.png"
                  width="140"
                />
                {/* <Typography.Title level={3}>Welcome to Supabase Auth</Typography.Title> */}
              </div>
              <h1 className="mb-8 text-3xl text-center">Reset Password</h1>

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
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="otp"
                placeholder="One Time Password"
                {...formik.getFieldProps("otp")}
              />
              {formik.touched.otp && formik.errors.otp ? (
                <div className="text-red-500">{formik.errors.otp}</div>
              ) : null}

              <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="password"
                placeholder="Password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}

              <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="confirm_password"
                placeholder="Confirm Password"
                {...formik.getFieldProps("confirm_password")}
              />
              {formik.touched.confirm_password &&
              formik.errors.confirm_password ? (
                <div className="text-red-500">
                  {formik.errors.confirm_password}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-gray-600 text-white hover:bg-gray-700 focus:outline-none my-1"
              >
                {loading ? <SyncOutlined spin /> : "Submit"}
              </button>

              {/* <div className="text-center text-sm text-grey-dark mt-4">
                By signing up, you agree to the
                <a
                  className="no-underline border-b border-grey-dark text-grey-dark"
                  href="#"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="no-underline border-b border-grey-dark text-grey-dark"
                  href="#"
                >
                  Privacy Policy
                </a>
              </div> */}
            </div>

            {/* <div className="text-grey-dark mt-6">
              Already have an account?
              <Link href="/login">
                <a className="no-underline border-b border-blue-700 text-blue-700">
                  Log in
                </a>
              </Link>
              .
            </div> */}
          </div>
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
