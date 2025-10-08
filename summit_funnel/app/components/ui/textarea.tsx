/opt/homebrew/bin/node
./app/components/ui/textarea.tsx
import * as React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function composeClasses(base: string, extra?: string): string {
  return extra ? `${base} ${extra}` : base;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={composeClasses(
        "flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 placeholder:text-slate-400",
        className,
      )}
      {...props}
    />
  );
});
