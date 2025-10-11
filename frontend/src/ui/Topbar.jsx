import { Menu, Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
      {/* Left: mobile menu button + title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center h-9 w-9 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
          onClick={() => alert("Hook this to open a mobile drawer")}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-sm text-slate-900">Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Dashboard · Projects</p>
        </div>
      </div>

      {/* Right: search + notifications + avatar */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-64 border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        <button
          type="button"
          className="relative inline-flex items-center justify-center h-9 w-9 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[10px] text-white">
            3
          </span>
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <button
          type="button"
          className="inline-flex items-center gap-3 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-opacity"
          aria-label="User menu"
        >
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm text-slate-900">Admin User</span>
            <span className="text-xs text-slate-500">admin@company.com</span>
          </div>
          <div className="h-9 w-9 border border-slate-200 bg-slate-100 flex items-center justify-center text-sm text-slate-700">
            AU
          </div>
        </button>
      </div>
    </header>
  );
}
