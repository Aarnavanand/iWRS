"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Breadcrumb = ({ pageName }) => {
  const fullPath = usePathname();
  const pageTitle = fullPath.replace(/-/g, " ").split("/").pop();
  // const pageTitle = fullPath.replace(/\//g, " / ");
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageTitle}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard
            </Link>
          </li>
          <li className="font-medium text-primary">
            {fullPath.replace(/\//g, " / ").replace("/ dashboard", "")}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
