"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Eye, EyeOff, X } from "lucide-react"

const mdInputVariants = cva(
  "flex w-full transition-all duration-200 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outlined:
          "border-2 border-input bg-transparent rounded-md focus:border-primary focus:ring-0 hover:border-primary/50",
        filled:
          "border-0 border-b-2 border-input bg-muted rounded-t-md rounded-b-none focus:border-primary focus:bg-muted/80",
        standard: "border-0 border-b-2 border-input bg-transparent rounded-none focus:border-primary",
      },
      inputSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "outlined",
      inputSize: "md",
    },
  },
)

export interface MdInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof mdInputVariants> {
  label?: string
  helperText?: string
  error?: boolean
  success?: boolean
  errorMessage?: string
  successMessage?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  showPasswordToggle?: boolean
}

const MdInput = React.forwardRef<HTMLInputElement, MdInputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      label,
      helperText,
      error,
      success,
      errorMessage,
      successMessage,
      leftIcon,
      rightIcon,
      clearable,
      onClear,
      showPasswordToggle,
      value,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const inputType = showPasswordToggle && type === "password" ? (showPassword ? "text" : "password") : type

    const hasValue = value !== undefined && value !== ""

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              isFocused ? "text-primary" : "text-foreground",
              error && "text-destructive",
              success && "text-success",
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-3 text-muted-foreground">{leftIcon}</span>}
          <input
            type={inputType}
            className={cn(
              mdInputVariants({ variant, inputSize }),
              leftIcon && "pl-10",
              (rightIcon || clearable || showPasswordToggle) && "pr-10",
              error && "border-destructive focus:border-destructive",
              success && "border-success focus:border-success",
              className,
            )}
            ref={ref}
            value={value}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          <div className="absolute right-3 flex items-center gap-1">
            {clearable && hasValue && (
              <button
                type="button"
                onClick={onClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
            {!showPasswordToggle && rightIcon}
            {error && <AlertCircle className="h-4 w-4 text-destructive" />}
            {success && <CheckCircle2 className="h-4 w-4 text-success" />}
          </div>
        </div>
        {(helperText || errorMessage || successMessage) && (
          <p className={cn("text-xs", error ? "text-destructive" : success ? "text-success" : "text-muted-foreground")}>
            {error ? errorMessage : success ? successMessage : helperText}
          </p>
        )}
      </div>
    )
  },
)
MdInput.displayName = "MdInput"

export { MdInput, mdInputVariants }
