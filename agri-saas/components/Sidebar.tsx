"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  FiBarChart2, 
  FiChevronLeft, 
  FiChevronRight, 
  FiGrid, 
  FiHelpCircle, 
  FiHome, 
  FiLogOut, 
  FiMap, 
  FiSettings,
  FiPackage,
  FiUsers,
  FiCheckSquare,
  FiBell,
  FiTool,
  FiDollarSign
} from "react-icons/fi";
import { useAuth } from "./AuthProvider";
import { Button } from "./Button";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: FiHome, description: "Overview" },
  { label: "Farms", href: "/farms", icon: FiMap, description: "Farm management" },
  { label: "Crops", href: "/crops", icon: FiGrid, description: "Crop tracking" },
  { label: "Tasks", href: "/tasks", icon: FiCheckSquare, description: "Task management" },
  { label: "Inventory", href: "/inventory", icon: FiPackage, description: "Resources" },
  { label: "Equipment", href: "/equipment", icon: FiTool, description: "Machinery" },
  { label: "Analytics", href: "/analytics", icon: FiBarChart2, description: "Reports" },
  { label: "Team", href: "/team", icon: FiUsers, description: "Workforce" },
  { label: "Subscription", href: "/subscription", icon: FiDollarSign, description: "Billing" },
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
            RP
          </div>
          <div className="sidebar-brand-copy">
            <div className="sidebar-title">Rampart Power</div>
            <div className="sidebar-subtitle">Agricultural SaaS</div>
          </div>
        </div>

        <Button
          variant="sidebar"
          type="button"
          onClick={() => setIsCollapsed((current) => !current)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FiChevronRight aria-hidden="true" /> : <FiChevronLeft aria-hidden="true" />}
        </Button>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <div className="nav-heading">Main Menu</div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
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

      {/* Notifications section */}
      <div className="sidebar-section">
        <Link
          className="nav-link"
          href="/notifications"
          title={isCollapsed ? "Notifications" : undefined}
        >
          <span className="nav-icon" aria-hidden="true">
            <FiBell />
          </span>
          <span className="nav-copy">
            <span className="nav-label">Notifications</span>
          </span>
        </Link>
      </div>

      <div className="sidebar-support">
        <FiHelpCircle className="sidebar-support-icon" aria-hidden="true" />
        <div>
          <strong>{user?.name ?? "Farm Manager"}</strong>
          <span>{user?.email ?? "Signed in"}</span>
        </div>
        <Button variant="logout" type="button" onClick={logout} title="Sign out">
          <FiLogOut aria-hidden="true" />
          <span>Sign out</span>
        </Button>
      </div>
    </aside>
  );
}
