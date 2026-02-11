"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarProps, NavItem } from "./types";
import { Clock3, FileText, FolderClosed, House, Star, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function HomeIcon({ className }: { className?: string }) {
  return <House className={className} />;
}

function FolderIcon({ className }: { className?: string }) {
  return <FolderClosed className={className} />;
}

function DocumentIcon({ className }: { className?: string }) {
  return <FileText className={className} />;
}

function ClockIcon({ className }: { className?: string }) {
  return <Clock3 className={className} />;
}

function StarIcon({ className }: { className?: string }) {
  return <Star className={className} />;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Input Sets", href: "/inputs", icon: FolderIcon },
  { name: "Prompts", href: "/prompts", icon: DocumentIcon },
  { name: "Run History", href: "/runs", icon: ClockIcon },
  { name: "Review", href: "/review", icon: StarIcon },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-sidebar transition-transform duration-300 ease-in-out md:static md:translate-x-0 bg-sidebar ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Studio Prompt Lab
          </h1>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:text-white md:hidden"
            style={{ backgroundColor: "transparent" }}
            aria-label="Close menu"
          >
            <X className="size-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col p-4">
          <ul className="flex flex-1 flex-col gap-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`group flex gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? "var(--sidebar-active)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor =
                          "var(--sidebar-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div
          className="p-4"
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        >
          <ThemeToggle />
          <p className="mt-3 text-xs text-zinc-500">Studio Prompt Lab v1.0</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
