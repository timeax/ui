import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const paperVariants = cva('rounded-xl text-card-foreground transition-colors duration-200', {
    variants: {
        variant: {
            solid: '',
            outline: 'border',
            ghost: 'bg-transparent border-none shadow-none',
        },
        level: {
            outer: '',
            inner: '',
        },
        density: {
            none: 'p-0',
            small: 'p-2',
            compact: 'p-3',
            normal: 'p-5',
            loose: 'p-8',
        },
        backdrop: {
            true: 'backdrop-blur supports-[backdrop-filter]:bg-card/70',
            false: '',
        },
    },
    compoundVariants: [
        {
            variant: 'solid',
            level: 'outer',
            className: 'bg-card border shadow-xs',
        },
        {
            variant: 'solid',
            level: 'inner',
            className: 'bg-muted/40 border-none',
        },
        {
            variant: 'solid',
            level: 'outer',
            backdrop: true,
            className: 'supports-[backdrop-filter]:bg-card/70 border shadow-xs',
        },
        {
            variant: 'solid',
            level: 'inner',
            backdrop: true,
            className: 'supports-[backdrop-filter]:bg-muted/40 border-none',
        },
        {
            variant: 'outline',
            className: 'bg-transparent border',
        },
    ],
    defaultVariants: {
        variant: 'solid',
        level: 'outer',
        density: 'normal',
        backdrop: false,
    },
});

export interface PaperProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof paperVariants> {}

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
    ({ className, variant, level, density, backdrop, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(paperVariants({ variant, level, density, backdrop }), className)}
                {...props}
            />
        );
    }
);

Paper.displayName = 'Paper';
export default Paper;
export { paperVariants };
