import type * as React from "react"
import { cn } from "@/lib/utils"

export interface MdCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "outlined" | "filled"
  hoverable?: boolean
}

export function MdCard({ className, variant = "elevated", hoverable, children, ...props }: MdCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden transition-all duration-200",
        variant === "elevated" && "bg-card shadow-md",
        variant === "outlined" && "bg-card border-2 border-border",
        variant === "filled" && "bg-muted",
        hoverable && "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function MdCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4 border-b border-border", className)} {...props} />
}

export function MdCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-card-foreground", className)} {...props} />
}

export function MdCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground mt-1", className)} {...props} />
}

export function MdCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4", className)} {...props} />
}

export function MdCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4 border-t border-border flex items-center gap-2", className)} {...props} />
}
