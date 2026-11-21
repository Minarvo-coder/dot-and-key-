"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/AppContext";
import {
  LayoutDashboard,
  Package,
  Scale,
  MessageSquareQuote,
  TrendingUp,
  PenTool,
  Grid,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    setIsHelpModalOpen,
    setIsSettingsModalOpen,
    selectedProduct,
  } = useApp();

  const navigationGroups = [
    {
      group: "WORKSPACE",
      items: [
        { label: "Overview", href: "/overview", icon: LayoutDashboard },
        { label: "Product Library", href: "/products", icon: Package },
      ],
    },
    {
      group: "INTELLIGENCE",
      items: [
        { label: "Competitor Analysis", href: "/competitors", icon: Scale },
        { label: "Review Insights", href: "/reviews", icon: MessageSquareQuote },
        { label: "Market Opportunities", href: "/opportunities", icon: TrendingUp },
        { label: "SWOT Analysis", href: "/swot", icon: Grid },
      ],
    },
    {
      group: "CONTENT CREATION",
      items: [
        { label: "Marketing Studio", href: "/marketing-studio", icon: PenTool },
      ],
    },
  ];

  function isActive(href) {
    if (href === "/overview" && (pathname === "/" || pathname === "/overview")) {
      return true;
    }
    return pathname === href;
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-app-card border-r border-line-subtle transition-all duration-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-line-subtle shrink-0">
        <Link
          href="/overview"
          className="flex items-center gap-3 overflow-hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center text-ink-inverted font-serif font-bold text-lg shadow-clay-sm shrink-0">
            K
          </div>
          {!isSidebarCollapsed && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold text-ink-primary tracking-tight">
                  KAIROS
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sand-light text-ink-primary border border-line-subtle font-mono font-medium">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-medium truncate">
                Dot & Key Studio
              </span>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden p-1.5 text-ink-muted hover:text-ink-primary rounded-lg hover:bg-app-subtle transition-colors"
          title="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-app-subtle transition-colors border border-line-subtle/50"
          title={isSidebarCollapsed ? "Expand sidebar (256px)" : "Collapse sidebar (72px)"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>



      {/* Navigation Links Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5 custom-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {/* Group Label */}
            {!isSidebarCollapsed ? (
              <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-ink-muted uppercase">
                {group.group}
              </div>
            ) : (
              <div className="w-full h-px bg-line-subtle/60 my-2" />
            )}

            {/* Group Nav Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      active
                        ? "bg-terracotta text-ink-inverted font-semibold shadow-clay-sm"
                        : "text-ink-muted hover:text-ink-primary hover:bg-app-subtle"
                    } ${isSidebarCollapsed ? "justify-center px-2" : ""}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                        active ? "text-ink-inverted" : "text-ink-muted group-hover:text-ink-primary"
                      }`}
                    />
                    {!isSidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-200 z-30 ${
          isSidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop and Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink-primary/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-clay-lg z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
