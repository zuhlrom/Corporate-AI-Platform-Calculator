import { NavLink, Outlet } from "react-router-dom"

import { SHEET_NAV } from "@/lib/excelLabels"
import { cn } from "@/lib/utils"

export default function AppLayout() {
  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-muted/30">
        <div className="border-b border-border p-3">
          <div className="text-xs font-medium text-muted-foreground">
            Landi / fenaco
          </div>
          <div className="text-sm font-semibold leading-tight">
            AI Platform Calculator
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2 text-sm">
          {SHEET_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-2 py-1.5 transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <span className="font-mono text-[10px] opacity-80">
                {item.code}
              </span>{" "}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-2 text-[10px] leading-snug text-muted-foreground">
          UI-Build <span className="font-mono text-foreground">2026-04-22-workshop</span>
          <br />
          Nach Update: Hard-Reload (⌘⇧R)
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
