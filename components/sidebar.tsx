"use client";

import Image from "next/image";
import Link from "next/link";

import {
  LayoutDashboard,
  ActivitySquare,
  HelpCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-500",
  },
  {
    label: "Generate Music",
    icon: ActivitySquare,
    href: "/musicgen",
    color: "text-green-500",
  },
  {
    label: "Help",
    icon: HelpCircle,
    href: "/help",
    color: "text-orange-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const SideBar = () => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 flex flex-col h-full text-white bg-slate-900">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center mb-14">
          <div className="relative w-14 h-14 mr-4">
            <Image fill alt="logo" src="/logo.png" />
          </div>
          <h1 className=" text-2xl font-bold"> MusicGen</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link href={route.href} key={route.href}>
              <div
                className={cn(
                  "flex items-center space-x-4 p-3 mb-2 hover:text-white hover:bg-white/10 rounded-lg bg-",
                  pathname === route.href ? "text-white bg-green-500/20" : ""
                )}
              >
                <route.icon className={cn("h-6 w-6", route.color)} />
                <span className="text-lg font-semibold">{route.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
