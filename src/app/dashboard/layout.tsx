import DashboardTopBar from "@/components/header/DashboardTopBar";
import Link from "next/link";
import React from "react";

function dashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="relative h-screen overflow-hidden dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div className="relative hidden h-screen shadow-lg lg:block w-80">
            <div className="flex h-full flex-col bg-zinc-900 text-gray-200">
              <div className="flex items-center justify-center h-16 border-b border-zinc-800">
                <Link href="/" className="flex items-center space-x-2">
                  <img src="/pilput.png" alt="pilput" className="h-8 w-auto" />
                </Link>
              </div>
              
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="mb-4">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Main
                  </p>
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/dashboard"
                      className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/users"
                      className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Users
                    </Link>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Content
                  </p>
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/dashboard/posts"
                      className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                        />
                      </svg>
                      Posts
                    </Link>
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">Admin User</p>
                    <p className="text-xs text-gray-400 truncate">admin@pilput.dev</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col relative w-full h-screen p-3 bg-gray-200">
            <DashboardTopBar />
            <div className="h-full mt-5 overflow-y-auto">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}

export default dashboardLayout;
