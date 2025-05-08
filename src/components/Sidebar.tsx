"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon,
  TruckIcon,
  ArrowRightEndOnRectangleIcon,
  CpuChipIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Dashboard", href: "/environmental", icon: ChartBarIcon },
    { name: "Vessels", href: "/vessels", icon: TruckIcon },
    { name: "System Overview", href: "/system-overview", icon: CpuChipIcon },
    { name: "Sensors", href: "/sensors", icon: BeakerIcon },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Port Monitor</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
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
            </Link>
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
    </div>
  );
};

export default Sidebar;
