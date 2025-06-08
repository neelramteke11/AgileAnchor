import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { GlowEffect } from "./glow-effect"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#fb8500] text-black hover:bg-[#e07600]",
        destructive:
          "bg-[#fb8500] text-black hover:bg-[#e07600]",
        outline:
          "border border-input bg-[#fb8500] text-black hover:bg-[#e07600] hover:text-black",
        secondary:
          "bg-[#fb8500] text-black hover:bg-[#e07600]",
        ghost: "bg-[#fb8500] text-black hover:bg-[#e07600] hover:text-black",
        link: "bg-[#fb8500] text-black underline-offset-4 hover:underline hover:bg-[#e07600]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  glow?: boolean
  glowColors?: string[]
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, glow = true, glowColors = ['#fb8500', '#e07600', '#cc6600', '#ff9500'], ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <div className="relative">
        {glow && (
          <GlowEffect
            colors={glowColors}
            mode="pulse"
            blur="soft"
            duration={3}
            scale={0.95}
            className="rounded-md"
          />
        )}
        <Comp
          className={cn(buttonVariants({ variant, size, className }), "relative z-10")}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }