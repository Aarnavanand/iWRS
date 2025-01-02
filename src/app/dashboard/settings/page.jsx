"use client";

import { useState } from "react";

const Settings = () => {
  const [email, setEmail] = useState("kalmuhey@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Handle password update request
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setStatusMessage(""); // Clear previous messages

    try {
      // Make the request with credentials included to send cookies
      const response = await fetch("/api/users/updatePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password: currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setStatusMessage("Password updated successfully!");
        setCurrentPassword(""); // Clear the input fields after success
        setNewPassword("");
      } else {
        const error = await response.json();
        setStatusMessage(error.message || "Error updating password.");
      }
    } catch (error) {
      setStatusMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-1">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Update Password
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleUpdatePassword}>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="currentPassword"
                  >
                    Current Password
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                {statusMessage && (
                  <div
                    className={`mb-4 text-sm ${
                      statusMessage.includes("success")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}
                <div className="flex justify-end gap-4.5 flex-wrap">
                  <button
                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="button"
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
