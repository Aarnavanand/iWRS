"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { usePathname } from "next/navigation";

export default function DefaultLayout({ children }) {
  // const path = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="dv1 relative flex flex-1 flex-col ">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div
              className={` ml-14 w-[calc(100vw-3.5rem)]  p-4 duration-300 ease-linear md:p-6 2xl:p-10 ${sidebarOpen ? "md:ml-72.5  md:w-[calc(100vw-18.125rem)]" : "md:ml-14  md:w-[calc(100vw-3.5rem)]"}`}
            >
              <Breadcrumb />
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
