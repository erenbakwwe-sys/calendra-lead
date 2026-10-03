import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'outline'
  dot?: boolean
}

function Badge({ className, variant = "default", dot = false, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase transition-colors",
        {
          "border-dark-border bg-dark-800 text-gray-300": variant === "default",
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400": variant === "success",
          "border-amber-500/30 bg-amber-500/10 text-amber-300": variant === "warning",
          "border-red-500/30 bg-red-500/10 text-red-400": variant === "danger",
          "border-blue-500/30 bg-blue-500/10 text-blue-400": variant === "info",
          "border-gold-500/40 bg-gold-500/15 text-gold-300": variant === "gold",
          "border-dark-border/80 text-gray-400 bg-transparent": variant === "outline",
        },
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === 'success' && "bg-emerald-400 animate-pulse",
            variant === 'warning' && "bg-amber-400",
            variant === 'danger' && "bg-red-400",
            variant === 'gold' && "bg-gold-400",
            variant === 'info' && "bg-blue-400",
            variant === 'default' && "bg-gray-400"
          )}
        />
      )}
      <span>{children}</span>
    </div>
  )
}

export { Badge }
