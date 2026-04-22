import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function SectionCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-xs",
        className,
      )}
    >
      <header className="mb-3 border-b border-border pb-2">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  )
}
