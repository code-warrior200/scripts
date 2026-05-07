"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiBarChart2, FiChevronLeft, FiChevronRight, FiGrid, FiHelpCircle, FiHome, FiLogOut, FiMap, FiSettings } from "react-icons/fi";
import { useAuth } from "./AuthProvider";

const navItems = [
  { label: "Home", href: "/", icon: FiHome, description: "Overview" },
  { label: "Dashboard", href: "/dashboard", icon: FiBarChart2, description: "Metrics" },
  { label: "Farms", href: "/farms", icon: FiMap, description: "Locations" },
  { label: "Crops", href: "/crops", icon: FiGrid, description: "Field work" },
  { label: "Settings", href: "/settings", icon: FiSettings, description: "Account" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar${isCollapsed ? " collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">
            A
          </div>
          <div className="sidebar-brand-copy">
            <div className="sidebar-title">AgriSaaS</div>
            <div className="sidebar-subtitle">Farm operations platform</div>
          </div>
        </div>

        <button
          className="sidebar-toggle"
          type="button"
          onClick={() => setIsCollapsed((current) => !current)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FiChevronRight aria-hidden="true" /> : <FiChevronLeft aria-hidden="true" />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <div className="nav-heading">Workspace</div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  className={`nav-link${isActive ? " active" : ""}`}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="nav-copy">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-support">
        <FiHelpCircle className="sidebar-support-icon" aria-hidden="true" />
        <div>
          <strong>{user?.name ?? "Farm Manager"}</strong>
          <span>{user?.email ?? "Signed in"}</span>
        </div>
        <button className="sidebar-logout" type="button" onClick={logout} title="Sign out">
          <FiLogOut aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
