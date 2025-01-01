"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import logo from "@/assets/color.svg";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () =>
    setPasswordVisible((prevVisible) => !prevVisible);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/users/login",
        form,
        { timeout: 5000 }
      );

      const { token } = response.data;

      // Store token
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "An unexpected error occurred.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-200 px-4 sm:px-6 md:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.3)_20%,_transparent_60%)] opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-transparent to-blue-500 opacity-10"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-xl bg-white p-6 sm:p-8 lg:p-10 shadow-lg">
        <div className="flex flex-col items-center">
          <Image
            src={logo}
            alt="Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain"
          />
          <h1 className="mt-3 text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 text-center">
            Welcome to iWRS
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8">
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="mt-1 block w-full rounded-lg border px-4 py-2 text-sm sm:text-base shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              className="mt-1 block w-full rounded-lg border px-4 py-2 text-sm sm:text-base shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              {passwordVisible ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="mb-6 flex items-center">
            <div
              className={`relative h-4 w-8 cursor-pointer rounded-full transition-colors ${
                rememberMe ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setRememberMe((prev) => !prev)}
              aria-label="Remember me toggle"
            >
              <div
                className={`absolute left-0.5 top-0.5 h-3 w-3 transform rounded-full shadow-md transition-transform ${
                  rememberMe ? "translate-x-4 bg-white" : "bg-gray-100"
                }`}
              ></div>
            </div>
            <label className="ml-2 text-sm text-gray-700">Remember me</label>
          </div>

          {/* Error Message */}
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full rounded-lg bg-blue-600 px-4 py-2 text-sm sm:text-base text-white font-medium ${
              loading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
