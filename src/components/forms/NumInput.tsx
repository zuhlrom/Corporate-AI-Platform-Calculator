import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type Props = Omit<ComponentProps<"input">, "value" | "onChange"> & {
  value: number
  onChange: (v: number) => void
  /** When true, use neutral styling (derived / read-only numeric). */
  derived?: boolean
}

export function NumInput({
  value,
  onChange,
  derived,
  className,
  step = "any",
  ...rest
}: Props) {
  return (
    <input
      type="number"
      step={step}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => {
        const raw = e.target.value
        onChange(raw === "" ? 0 : Number(raw))
      }}
      className={cn(
        "w-full min-w-[6rem] rounded-md border border-input px-2 py-1 text-sm tabular-nums shadow-xs",
        derived
          ? "bg-muted/40 text-foreground"
          : "bg-yellow-50 text-blue-800 dark:bg-yellow-900/25 dark:text-blue-200",
        className,
      )}
      {...rest}
    />
  )
}
