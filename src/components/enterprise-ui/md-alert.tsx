"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react"

export interface MdAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error"
  title?: string
  closable?: boolean
  onClose?: () => void
  icon?: React.ReactNode
}

const alertIcons = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
}

const alertStyles = {
  info: "bg-info/10 border-info/30 text-info",
  success: "bg-success/10 border-success/30 text-success",
  warning: "bg-warning/10 border-warning/30 text-warning",
  error: "bg-destructive/10 border-destructive/30 text-destructive",
}

export function MdAlert({
  className,
  variant = "info",
  title,
  closable,
  onClose,
  icon,
  children,
  ...props
}: MdAlertProps) {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    <div
      role="alert"
      className={cn("relative flex gap-3 rounded-lg border p-4", alertStyles[variant], className)}
      {...props}
    >
      <span className="shrink-0">{icon || alertIcons[variant]}</span>
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {closable && (
        <button
          type="button"
          onClick={() => {
            setVisible(false)
            onClose?.()
          }}
          className="absolute right-3 top-3 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
