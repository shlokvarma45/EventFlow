import * as React from "react"
    import { cn } from "../../lib/utils"

    const Button = React.forwardRef(
      ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? "button" : "button"
        return (
          <Comp
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
              variant === "default" &&
              "bg-primary text-primary-foreground hover:bg-primary/90",
              variant === "destructive" &&
              "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              variant === "outline" &&
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              variant === "secondary" &&
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              size === "default" && "h-10 px-4 py-2",
              size === "sm" && "h-9 rounded-md px-3",
              size === "lg" && "h-11 rounded-md px-8",
              size === "icon" && "h-10 w-10",
              className
            )}
            ref={ref}
            {...props}
          />
        )
      }
    )
    Button.displayName = "Button"

    export { Button }
