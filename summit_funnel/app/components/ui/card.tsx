/opt/homebrew/bin/node
./app/components/ui/card.tsx
import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

function composeClasses(base: string, extra?: string): string {
  return extra ? `${base} ${extra}` : base;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...props }, ref) {
  return <div ref={ref} className={composeClasses("rounded-xl border border-slate-200 bg-white shadow-sm", className)} {...props} />;
});

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={composeClasses("flex flex-col space-y-1.5 p-6", className)} {...props} />;
});

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle({ className, ...props }, ref) {
  return <h3 ref={ref} className={composeClasses("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />;
});

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={composeClasses("text-sm text-slate-500", className)} {...props} />;
});

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={composeClasses("p-6 pt-0", className)} {...props} />;
});

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter({ className, ...props }, ref) {
  return <div ref={ref} className={composeClasses("flex items-center p-6 pt-0", className)} {...props} />;
});

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
