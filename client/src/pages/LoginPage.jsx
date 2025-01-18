import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../api/auth";
import signingImage from "../assets/signing_image.jpg";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters long"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await login(values);
        const { token, role } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        onLogin(role);

        if (role === "practitioner") {
          navigate("/practitioner-dashboard");
        } else if (role === "patient") {
          navigate("/patient-dashboard");
        }
      } catch (error) {
        setSubmitting(false);
        if (error.response) {
          const { message } = error.response.data;
          setErrors({ apiError: message || "Invalid login credentials" });
        } else {
          setErrors({ apiError: "Something went wrong. Please try again." });
        }
      }
    },
  });

  return (
    <div className="w-full h-screen flex items-start">
      <div className="relative w-1/2 h-full flex flex-col">
        <div className="absolute top-[40%] left-[10%] right-[10%] flex flex-col">
          <h1 className="text-4xl font-bold text-white my-4">
            Patient Medical History Management System
          </h1>

          <p className="text-xl text-white font-normal">
            Welcome to the dashboard for the medical history management
          </p>
        </div>
        <img
          src={signingImage}
          className="w-full h-full object-cover"
          alt="doctor"
        />
      </div>

      <div className="w-1/2 h-full bg-gray-50 flex flex-col p-20 pt-[15%]">
        <h2 className="text-4xl font-semibold text-gray-700 mb-6">Login</h2>
        <p className="text-gray-500 mb-6">
          Welcome back! Please enter your details to continue.
        </p>
        {formik.errors.apiError && (
          <div className="mb-4 text-red-500 text-sm">
            {formik.errors.apiError}
          </div>
        )}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={`w-full px-4 py-3 border ${
                formik.touched.username && formik.errors.username
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-2 text-red-500 text-sm">
                {formik.errors.username}
              </p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`w-full px-4 py-3 border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-2 text-red-500 text-sm">
                {formik.errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full py-3 rounded-md text-white ${
              formik.isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 transition"
            }`}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
