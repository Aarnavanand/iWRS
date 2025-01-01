"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../assets/color.svg";
import Link from "next/link";
import axios from "axios";

// import { Metadata } from "next";
// export const metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };


export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const [protocol, setProtocol] = useState({ number: "", title: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNoThanks = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 1500);
  };

  useEffect(() => {
    const fetchProtocol = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/getStudy");
        if (data.studies?.length) {
          const { protocolNo, protocolTitle } = data.studies[0];
          setProtocol({ number: protocolNo, title: protocolTitle });
        } else {
          setError("No protocol data available.");
        }
      } catch (err) {
        setError("Failed to load protocol data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProtocol();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 space-y-12">
      {isVisible && (
        <>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
              Welcome to IWRS Home
            </h1>
            <p className="text-gray-600 text-sm">
              "Your gateway to seamless protocol management"
            </p>
          </div>

          <Image
            src="https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=2070&auto=format&fit=crop"
            alt="Unsplash"
            width={500}
            height={500}
            className="rounded-2xl saturate-100 shadow-2xl hover:scale-105 hover:saturate-150 transition-transform duration-300"
          />

          <div className="bg-gradient-to-r from-blue-100 via-white to-blue-50 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-4xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex items-center justify-center w-full md:w-1/3">
              <div className="bg-gradient-to-b from-gray-50 to-gray-200 p-4 rounded-lg shadow-md">
                <Image src={logo} alt="Logo" className="h-24 w-24 object-contain" />
              </div>
            </div>

            <div className="text-gray-800 flex flex-col justify-center items-start w-full md:w-2/3">
              {loading ? (
                <p className="text-sm text-blue-500">Loading protocol data...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold mb-2">Welcome, iWRS!</h1>
                  <p className="text-sm mb-1">
                    Protocol No: <span className="font-medium">{protocol.number}</span>
                  </p>
                  <p className="text-sm mb-4">
                    Protocol Title: <span className="font-medium">{protocol.title}</span>
                  </p>
                </>
              )}

              <div className="flex gap-4">
                <Link href="/login">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-500 transition duration-300">
                    Login
                  </button>
                </Link>
                <button
                  onClick={handleNoThanks}
                  className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 transition duration-300"
                >
                  No Thanks
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
