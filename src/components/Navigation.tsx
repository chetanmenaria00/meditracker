"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, Heart, BarChart3, Settings } from "lucide-react";
import Image from "next/image";
import logo from '../../public/logo-brand.png'

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Prescriptions", href: "/prescriptions", icon: Pill },
  { name: "Health Issues", href: "/health-issues", icon: Heart },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={navigation[0].href}>
                {/* <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  MediTracker
                </h1> */}
                <Image width={200} alt='logo' src={logo}/>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-blue-500 text-gray-900 dark:text-white"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
