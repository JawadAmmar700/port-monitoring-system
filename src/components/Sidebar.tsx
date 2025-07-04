"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  HomeIcon,
  ChartBarIcon,
  TruckIcon,
  ArrowRightEndOnRectangleIcon,
  CpuChipIcon,
  BeakerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import UnauthorizedPopup from "./UnauthorizedPopup";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isEnvironmentalOpen, setIsEnvironmentalOpen] = useState(true);
  const [showUnauthorizedPopup, setShowUnauthorizedPopup] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    {
      name: "Environmental",
      href: "/dashboard/environmental",
      icon: ChartBarIcon,
      subRoutes: [
        { name: "Overview", href: "/dashboard/environmental" },
        {
          name: "Historical Data",
          href: "/dashboard/environmental/historical",
        },
      ],
    },
    { name: "Vessels", href: "/dashboard/vessels", icon: TruckIcon },
    { name: "System Overview", href: "/system-overview", icon: CpuChipIcon },
    { name: "Sensors", href: "/dashboard/sensors", icon: BeakerIcon },
  ];

  const handleNavigation = (href: string) => {
    const isRestrictedRoute =
      href.startsWith("/dashboard/environmental") ||
      href.startsWith("/dashboard/sensors");

    if (isRestrictedRoute && session?.user?.type !== "MANAGER") {
      setShowUnauthorizedPopup(true);
      return;
    }

    router.push(href);
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Port Monitor</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.subRoutes &&
              item.subRoutes.some((sub) => pathname === sub.href));

          return (
            <div key={item.name}>
              {item.subRoutes ? (
                <>
                  <button
                    onClick={() => setIsEnvironmentalOpen(!isEnvironmentalOpen)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                    {isEnvironmentalOpen ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                  {isEnvironmentalOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subRoutes.map((subRoute) => {
                        const isSubActive = pathname === subRoute.href;
                        return (
                          <button
                            key={subRoute.name}
                            onClick={() => handleNavigation(subRoute.href)}
                            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                              isSubActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {subRoute.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/api/auth/signout"
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowRightEndOnRectangleIcon
            className="mr-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Logout
        </Link>
      </div>

      <UnauthorizedPopup
        isOpen={showUnauthorizedPopup}
        onClose={() => setShowUnauthorizedPopup(false)}
      />
    </div>
  );
};

export default Sidebar;
