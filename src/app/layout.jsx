"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function RootLayout({ children }) {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="overflow-x-clip">
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader/> : children}
        </div>
      </body>
    </html>
  );
}
