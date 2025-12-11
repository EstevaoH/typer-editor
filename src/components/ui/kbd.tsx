import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const kbdVariants = cva(
  "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 border-b-2 text-zinc-600 dark:text-zinc-300",
        outline: "border-foreground/20",
        ghost: "border-none bg-transparent shadow-none",
      },
      size: {
        default: "h-5 min-h-[20px] text-[10px]",
        sm: "h-4 min-h-[16px] text-[9px] px-1",
        md: "h-6 min-h-[24px] text-xs px-2",
        lg: "h-7 min-h-[28px] text-sm px-2.5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof kbdVariants> { }

const Kbd = React.forwardRef<HTMLSpanElement, KbdProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <kbd
        className={cn(kbdVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Kbd.displayName = "Kbd"

export { Kbd, kbdVariants }
