/opt/homebrew/bin/node
./app/components/ui/input.tsx
import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function composeClasses(base: string, extra?: string): string {
  return extra ? `${base} ${extra}` : base;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={composeClasses(
        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 placeholder:text-slate-400",
        className,
      )}
      type={type}
      {...props}
    />
  );
});
