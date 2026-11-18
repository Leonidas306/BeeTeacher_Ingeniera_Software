"use client";

import { BookMarked, CalendarDays, DoorOpen, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const location = usePathname();

  const tabs = [
    { route: "/", label: "Tutores", icon: Users },
    { route: "/rooms", label: "Salones Vacíos", icon: DoorOpen },
    { route: "/agenda", label: "Mi Agenda", icon: CalendarDays },
    { route: "/logbook", label: "Mi Bitácora", icon: BookMarked },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <nav className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/90 dark:bg-[#0D1322]/90 backdrop-blur-md border border-amber-500/25 shadow-2xl">
        {tabs.map((tab) => {
          const isActive = location === tab.route;
          const Icon = tab.icon;
          return (
            <Link
              href={tab.route}
              key={tab.route}
              aria-label={tab.label}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors z-10 whitespace-nowrap ${
                isActive
                  ? "text-slate-950"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl -z-10 shadow-sm"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
