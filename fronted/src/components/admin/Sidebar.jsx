"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  AiIcon,
  CartIcon,
  CalendarIcon,
  UserIcon,
  TaskIcon,
  FormsIcon,
  TablesIcon,
  PagesIcon,
  LayoutIcon,
  LogoIcon,
  ChevronDownIcon,
  CategoryIcon,
  ProductIcon,
  RoomIcon
} from "./Icons";

export default function Sidebar({ sidebarOpen, setSidebarOpen, sidebarCollapsed }) {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "MENU",
      items: [
        {
          name: "Dashboard",
          href: "/admin",
          icon: DashboardIcon,
          hasSubmenu: true,
          submenuItems: [
            {
              name: "Category",
              href: "/admin/category",
              icon: CategoryIcon
            },
            {
              name: "Product",
              href: "/admin/product",
              icon: ProductIcon
            },
            {
              name: "Room-Type",
              href: "/admin/room-type",
              icon: RoomIcon
            }
          ]
        },
        {
          name: "AI Assistant",
          href: "/admin/ai-assistant",
          icon: AiIcon,
          badge: "NEW",
          hasSubmenu: true,
        },
        {
          name: "E-commerce",
          href: "/admin/ecommerce",
          icon: CartIcon,
          hasSubmenu: true,
        },
        {
          name: "Calendar",
          href: "/admin/calendar",
          icon: CalendarIcon,
        },
        {
          name: "User Profile",
          href: "/admin/profile",
          icon: UserIcon,
        },
        {
          name: "Task",
          href: "/admin/tasks",
          icon: TaskIcon,
          hasSubmenu: true,
        },
        {
          name: "Forms",
          href: "/admin/forms",
          icon: FormsIcon,
          hasSubmenu: true,
        },
        {
          name: "Tables",
          href: "/admin/tables",
          icon: TablesIcon,
          hasSubmenu: true,
        },
        {
          name: "Pages",
          href: "/admin/pages",
          icon: PagesIcon,
          hasSubmenu: true,
        },
        {
          name: "Layouts",
          href: "/admin/layouts",
          icon: LayoutIcon,
          badge: "NEW",
          hasSubmenu: true,
        }
      ]
    },
    {
      title: "SUPPORT",
      items: [
        {
          name: "Messages",
          href: "/admin/messages",
          icon: () => (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
        },
        {
          name: "Settings",
          href: "/admin/settings",
          icon: () => (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
          ),
        }
      ]
    }
  ];

  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    // Auto-expand menu group if a submenu item is active
    for (const group of menuGroups) {
      for (const item of group.items) {
        if (item.hasSubmenu && item.submenuItems) {
          const hasActiveSub = item.submenuItems.some((sub) => pathname === sub.href);
          if (hasActiveSub) {
            setTimeout(() => {
              setExpandedMenu(item.name);
            }, 0);
            return;
          }
        }
      }
    }
  }, [pathname]);

  return (
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/55 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar shell */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-[#1c2434] border-r border-[#e2e8f0] dark:border-[#2e3a47] transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          sidebarCollapsed ? "w-20 lg:w-20 overflow-visible" : "w-72.5 lg:w-72.5 overflow-y-hidden"
        }`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between gap-2 py-5.5 lg:py-6.5 ${sidebarCollapsed ? "px-4 justify-center" : "px-6"}`}>
          <Link href="/admin" className="flex items-center gap-3">
            <LogoIcon className="w-8 h-8 text-blue-500 fill-blue-500 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-2xl font-bold text-white tracking-wide transition-opacity duration-300">
                NESTRO
              </span>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="block lg:hidden text-[#8a99ad] hover:text-white"
            aria-label="Close Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu Links */}
        <div className={`no-scrollbar flex flex-col duration-300 ease-linear flex-1 py-4 ${sidebarCollapsed ? "px-2 overflow-visible" : "px-4 lg:px-6 overflow-y-auto"}`}>
          <nav className={`mt-5 py-4 space-y-6 ${sidebarCollapsed ? "px-1 overflow-visible" : "px-2 lg:px-4"}`}>
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {sidebarCollapsed ? (
                  <div className="h-[1px] bg-slate-700/50 my-4 mx-2" />
                ) : (
                  <h3 className="mb-4 ml-4 text-xs font-semibold text-[#8a99ad] uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isParentActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin/dashboard");
                    const isSubActive = item.submenuItems?.some((sub) => pathname === sub.href);
                    const isActive = isParentActive || isSubActive;
                    const isExpanded = expandedMenu === item.name;

                    return (
                      <li key={itemIdx} className="relative group/item">
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            if (item.hasSubmenu && item.submenuItems && item.submenuItems.length > 0) {
                              setExpandedMenu(isExpanded ? null : item.name);
                            }
                            if (window.innerWidth < 1024) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={`group relative flex items-center rounded-sm font-medium text-[#dee4ee] duration-300 ease-in-out hover:bg-[#333a48] ${
                            sidebarCollapsed ? "justify-center p-2.5" : "gap-2.5 px-4 py-2"
                          } ${
                            isActive ? "bg-[#333a48] text-white" : ""
                          }`}
                          title={sidebarCollapsed ? item.name : undefined}
                        >
                          <Icon className="w-5 h-5 text-[#8a99ad] group-hover:text-white transition-colors duration-300 flex-shrink-0" />
                          
                          {!sidebarCollapsed && (
                            <>
                              <span className="flex-1 truncate">{item.name}</span>

                              {item.badge && (
                                <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                                  {item.badge}
                                </span>
                              )}

                              {item.hasSubmenu && (
                                <ChevronDownIcon className={`w-4 h-4 text-[#8a99ad] group-hover:text-white transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                              )}
                            </>
                          )}
                        </Link>

                        {/* Submenu Item Container */}
                        {!sidebarCollapsed && item.hasSubmenu && item.submenuItems && item.submenuItems.length > 0 && (
                          <div className={`translate transform overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"}`}>
                            <ul className="mb-4 flex flex-col gap-1.5 pl-9">
                              {item.submenuItems.map((subItem, subIdx) => {
                                const isSubItemActive = pathname === subItem.href;
                                const SubIcon = subItem.icon;
                                return (
                                  <li key={subIdx}>
                                    <Link
                                      href={subItem.href}
                                      onClick={() => {
                                        if (window.innerWidth < 1024) {
                                          setSidebarOpen(false);
                                        }
                                      }}
                                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 font-medium text-[#8a99ad] duration-300 ease-in-out hover:text-white ${
                                        isSubItemActive ? "text-white" : ""
                                      }`}
                                    >
                                      {SubIcon && (
                                        <SubIcon className={`w-4 h-4 transition-colors duration-300 flex-shrink-0 ${isSubItemActive ? "text-white" : "text-[#8a99ad] group-hover:text-white"}`} />
                                      )}
                                      <span>{subItem.name}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {/* Floating Tooltip/Submenu (when collapsed) */}
                        {sidebarCollapsed && (
                          <div className={`absolute left-full top-0 ml-2 invisible opacity-0 translate-x-3 group-hover/item:visible group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 ease-in-out z-[99] bg-[#1c2434] border border-slate-700/50 rounded-sm shadow-xl overflow-hidden ${
                            item.submenuItems && item.submenuItems.length > 0 ? "w-48" : "w-max py-2 px-3 text-sm text-white font-medium"
                          }`}>
                            {item.submenuItems && item.submenuItems.length > 0 ? (
                              <>
                                {/* Title / Header */}
                                <div className="px-4 py-2 bg-[#24303f] text-white font-semibold text-sm flex items-center justify-between border-b border-slate-700/50">
                                  <span>{item.name}</span>
                                  {item.badge && (
                                    <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Submenu items list */}
                                <ul className="flex flex-col py-1 bg-[#1c2434]">
                                  {item.submenuItems.map((subItem, subIdx) => {
                                    const isSubItemActive = pathname === subItem.href;
                                    const SubIcon = subItem.icon;
                                    return (
                                      <li key={subIdx}>
                                        <Link
                                          href={subItem.href}
                                          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#8a99ad] hover:text-white hover:bg-[#333a48] transition-colors duration-200 ${
                                            isSubItemActive ? "text-white bg-[#333a48]/50" : ""
                                          }`}
                                        >
                                          {SubIcon && (
                                            <SubIcon className={`w-3.5 h-3.5 transition-colors duration-200 ${isSubItemActive ? "text-white" : "text-[#8a99ad] group-hover:text-white"}`} />
                                          )}
                                          <span>{subItem.name}</span>
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.badge && (
                                  <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

    </>
  );
}
