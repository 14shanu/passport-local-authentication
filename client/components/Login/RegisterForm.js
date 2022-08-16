import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useRef(null);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (values, submitProps) => {
    console.log(values);

    try {
      setLoading(true);
      const { data } = await axios.post("/expressapi/register", values);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: data.message,
        life: 3000,
      });
      setShowToast(true);
      submitProps.resetForm();

      console.log(data);
    } catch (error) {
      setLoading(false);
      setShowToast(false);
      toast.current.show({
        severity: "info",
        detail: error.response.data.message,
        life: 3000,
      });
    }
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .max(50)
      .required("Required"),
    last_name: Yup.string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .max(50)
      .required("Required"),
    email: Yup.string().email("Invalid Email Format").required("Required"),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const checkStatus = () => {
    if (showToast) {
      router.push("/user/emailverification");
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
              <h1 className="mb-8 text-3xl text-center">Registration</h1>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="first_name"
                placeholder="First Name"
                {...formik.getFieldProps("first_name")}
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <div className="text-red-500">{formik.errors.first_name}</div>
              ) : null}

              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="last_name"
                placeholder="Last Name"
                {...formik.getFieldProps("last_name")}
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <div className="text-red-500">{formik.errors.last_name}</div>
              ) : null}

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
                {loading ? <SyncOutlined spin /> : "Register"}
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

export default RegisterForm;
