import { NavLink } from "react-router-dom";
import {
  Home,
  Folder,
  Package,
  CheckSquare,
  Settings,
  Users,
  DollarSign,
  LayoutDashboard,
} from "lucide-react";

const linkBase =
  "group flex items-center gap-3 px-3 py-2 text-sm transition-colors relative";
const linkIdle = "text-slate-600 hover:text-slate-900 hover:bg-slate-50";
const linkActive = "bg-slate-900 text-white";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen sticky top-0 w-64 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-slate-900 bg-slate-900 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-slate-900">Dashboard</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink
          end
          to="."
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              <Home className="w-4 h-4 flex-shrink-0" />
              <span>Overview</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-900" />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to="users"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>Users</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-900" />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to="projects"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              <Folder className="w-4 h-4 flex-shrink-0" />
              <span>Projects</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-900" />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to="materials"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              <Package className="w-4 h-4 flex-shrink-0" />
              <span>Materials</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-900" />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to="budget"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span>Budget</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-900" />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to="tasks"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              <CheckSquare className="w-4 h-4 flex-shrink-0" />
              <span>Tasks</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-900" />
              )}
            </>
          )}
        </NavLink>

        {/* Divider */}
        <div className="py-3">
          <div className="h-px bg-slate-200" />
        </div>

        <NavLink
          to="settings"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span>Settings</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-900" />
              )}
            </>
          )}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-slate-50 text-xs text-slate-600">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
}
