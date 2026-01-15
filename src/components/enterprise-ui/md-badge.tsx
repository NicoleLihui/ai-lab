import type * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

export const mdBadgeVariants = cva("inline-flex items-center justify-center font-medium transition-colors", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      danger: "bg-destructive text-destructive-foreground",
      info: "bg-info text-info-foreground",
      outline: "border-2 border-primary text-primary bg-transparent",
    },
    size: {
      sm: "text-xs px-1.5 py-0.5 rounded",
      md: "text-xs px-2 py-0.5 rounded-md",
      lg: "text-sm px-2.5 py-1 rounded-md",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

export interface MdBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof mdBadgeVariants> {
  dot?: boolean
}

export function MdBadge({ className, variant, size, dot, children, ...props }: MdBadgeProps) {
  if (dot) {
    return (
      <span
        className={cn(
          "inline-flex h-2 w-2 rounded-full",
          variant === "primary" && "bg-primary",
          variant === "secondary" && "bg-secondary-foreground",
          variant === "success" && "bg-success",
          variant === "warning" && "bg-warning",
          variant === "danger" && "bg-destructive",
          variant === "info" && "bg-info",
          className,
        )}
        {...props}
      />
    )
  }

  return (
    <span className={cn(mdBadgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  )
}
