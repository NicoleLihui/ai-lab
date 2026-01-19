"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const mdButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-md hover:bg-primary-hover hover:shadow-lg active:shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: "bg-success text-success-foreground shadow-md hover:opacity-90 hover:shadow-lg",
        warning: "bg-warning text-warning-foreground shadow-md hover:opacity-90 hover:shadow-lg",
        danger: "bg-destructive text-destructive-foreground shadow-md hover:opacity-90 hover:shadow-lg",
        info: "bg-info text-info-foreground shadow-md hover:opacity-90 hover:shadow-lg",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary-light",
        ghost: "text-primary hover:bg-primary-light",
        link: "text-primary underline-offset-4 hover:underline",
        text: "text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-5 text-sm rounded-md",
        lg: "h-12 px-8 text-base rounded-lg",
        xl: "h-14 px-10 text-lg rounded-lg",
        icon: "h-10 w-10 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export interface MdButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof mdButtonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const MdButton = React.forwardRef<HTMLButtonElement, MdButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(mdButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </Comp>
    )
  },
)
MdButton.displayName = "MdButton"

export { MdButton, mdButtonVariants }
