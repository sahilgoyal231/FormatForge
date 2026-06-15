"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/video-upload", icon: UploadIcon, label: "Upload Media" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const mainRef = useRef<HTMLElement>(null);

  // Fix scroll position glitch on route change for custom scroll container
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-screen glass-panel border-r border-white/10 z-50 transform transition-all duration-300 ease-in-out flex flex-col 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center justify-between w-full">
            <div className={`flex items-center gap-2 cursor-pointer overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`} onClick={handleLogoClick}>
              <Logo className="w-8 h-8 shrink-0" />
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">FormatForge</span>
            </div>
            
            <button 
              className="hidden lg:block text-zinc-400 hover:text-white shrink-0 p-2 rounded-lg hover:bg-white/5" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <button className="lg:hidden text-zinc-400 hover:text-white shrink-0 p-2 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive 
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                    : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-cyan-400" : "text-zinc-400"}`} />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Area in Sidebar */}
        {user && (
          <div className="p-4 border-t border-white/5">
            <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.imageUrl}
                alt={user.username || "User"}
                className="w-9 h-9 rounded-full border border-white/10 shrink-0"
              />
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-white truncate">
                    {user.fullName || user.username || "User"}
                  </span>
                  <span className="text-xs text-zinc-500 truncate">
                    {user.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors ${isCollapsed ? 'px-0' : 'px-3'}`}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOutIcon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        {/* Background Blobs for main area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 glass-panel z-30 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-zinc-100 hidden sm:block capitalize">
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Additional header items can go here (e.g., notifications) */}
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden sm:block text-zinc-300">
                  Welcome, {user.fullName || user.username || "User"}!
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}