import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type PillSize = 'sm' | 'md' | 'lg';
export type PillVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type PillShape = 'rounded' | 'pill' | 'square';
export type PillTone =
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'theme'
    | 'white'
    | 'grey'
    | 'secondary'
    | 'neutral';

export const pillVariants = cva(
    'inline-flex items-center justify-center font-medium leading-none whitespace-nowrap transition-colors duration-150',
    {
        variants: {
            size: {
                sm: 'px-1.5 py-0.5 text-xs gap-1',
                md: 'px-2.5 py-1 text-xs gap-1.5',
                lg: 'px-3 py-1.5 text-sm gap-2',
            },
            shape: {
                rounded: 'rounded-xl',
                pill: 'rounded-full',
                square: 'rounded-md',
            },
        },
        defaultVariants: {
            size: 'md',
            shape: 'rounded',
        },
    },
);

const pillToneClasses: Record<PillTone, Record<PillVariant, string>> = {
    primary: {
        solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20',
        outline: 'border border-primary text-primary bg-transparent hover:bg-primary/10',
        ghost: 'text-primary bg-transparent hover:bg-primary/10',
    },
    success: {
        solid: 'bg-success text-success-foreground hover:bg-success/90',
        soft: 'bg-success/15 text-success hover:bg-success/25',
        outline: 'border border-success text-success bg-transparent hover:bg-success/10',
        ghost: 'text-success bg-transparent hover:bg-success/10',
    },
    info: {
        solid: 'bg-info text-info-foreground hover:bg-info/90',
        soft: 'bg-info/15 text-info hover:bg-info/25',
        outline: 'border border-info text-info bg-transparent hover:bg-info/10',
        ghost: 'text-info bg-transparent hover:bg-info/10',
    },
    warning: {
        solid: 'bg-warning text-warning-foreground hover:bg-warning/90',
        soft: 'bg-warning/15 text-warning hover:bg-warning/25',
        outline: 'border border-warning text-warning bg-transparent hover:bg-warning/10',
        ghost: 'text-warning bg-transparent hover:bg-warning/10',
    },
    danger: {
        solid: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        soft: 'bg-destructive/15 text-destructive hover:bg-destructive/25',
        outline: 'border border-destructive text-destructive bg-transparent hover:bg-destructive/10',
        ghost: 'text-destructive bg-transparent hover:bg-destructive/10',
    },
    theme: {
        solid: 'bg-theme text-theme-foreground border border-input hover:bg-accent hover:text-accent-foreground',
        soft: 'bg-accent text-accent-foreground hover:bg-accent/80',
        outline: 'border border-input text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground',
    },
    white: {
        solid: 'bg-card text-card-foreground border border-input/60 shadow-xs hover:bg-accent',
        soft: 'bg-muted/70 text-foreground hover:bg-muted',
        outline: 'border border-input text-foreground bg-transparent hover:bg-foreground/5',
        ghost: 'text-foreground bg-transparent hover:bg-foreground/5',
    },
    grey: {
        solid: 'bg-grey text-grey-foreground hover:bg-grey/90',
        soft: 'bg-grey/15 text-grey-foreground hover:bg-grey/25',
        outline: 'border border-input text-foreground bg-transparent hover:bg-foreground/5',
        ghost: 'text-foreground bg-transparent hover:bg-foreground/5',
    },
    secondary: {
        solid: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        soft: 'bg-secondary/15 text-secondary-foreground hover:bg-secondary/25',
        outline: 'border border-secondary text-secondary-foreground bg-transparent hover:bg-secondary/10',
        ghost: 'text-secondary-foreground hover:bg-secondary/10',
    },
    neutral: {
        solid: 'bg-neutral text-neutral-foreground hover:bg-neutral/90',
        soft: 'bg-neutral/15 text-neutral-foreground hover:bg-neutral/25',
        outline: 'border border-neutral text-neutral-foreground bg-transparent hover:bg-neutral/10',
        ghost: 'text-neutral-foreground hover:bg-neutral/10',
    },
};

const iconPresetClasses: Record<PillSize, string> = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-4.5',
};

export type PillProps<E extends React.ElementType = 'span'> = {
    /** Element or component type to render as. Defaults to 'span'. */
    as?: E;
    /** Content inside the pill. */
    children?: React.ReactNode;
    /** Size preset for font, padding, and gap. Defaults to 'md'. */
    size?: PillSize;
    /** Visual style variant. Defaults to 'soft'. */
    variant?: PillVariant;
    /** Corner rounding preset. Defaults to 'rounded'. */
    shape?: PillShape;
    /** Color tone mapping. Defaults to 'white'. */
    tone?: PillTone;
    /** Optional leading or trailing icon node. */
    icon?: React.ReactNode;
    /** Placement of the icon. Defaults to 'left'. */
    iconPosition?: 'left' | 'right';
    /** Sizing for the icon wrapper, either keyword or explicit pixels. */
    iconSize?: number | 'sm' | 'md' | 'lg';
    /** Extra classes applied to content text wrapper. */
    contentClassName?: string;
    /** Additional CSS classes for the pill element. */
    className?: string;
} & Omit<React.ComponentPropsWithoutRef<E>, 'size' | 'as'>;

type PillComponent = <E extends React.ElementType = 'span'>(
    props: PillProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null;

export const Pill: PillComponent = React.forwardRef(function Pill<E extends React.ElementType = 'span'>(
    {
        as,
        children,
        size = 'md',
        variant = 'soft',
        shape = 'rounded',
        tone = 'white',
        icon,
        iconPosition = 'left',
        iconSize,
        contentClassName,
        className,
        ...rest
    }: PillProps<E>,
    ref: React.Ref<Element>,
) {
    const Component = (as || 'span') as React.ElementType;
    const isInteractive = Component === 'button' || Component === 'a' || 'onClick' in rest;

    const resolvedIconClass =
        typeof iconSize === 'string'
            ? iconSize === 'sm'
                ? 'size-3'
                : iconSize === 'lg'
                  ? 'size-4.5'
                  : 'size-4'
            : iconSize == null
              ? iconPresetClasses[size]
              : undefined;

    const toneStyle = pillToneClasses[tone]?.[variant] ?? pillToneClasses.white[variant];

    return (
        <Component
            ref={ref}
            className={cn(
                pillVariants({ size, shape }),
                toneStyle,
                isInteractive &&
                    'cursor-pointer select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                className,
            )}
            {...rest}
        >
            {icon && iconPosition === 'left' && (
                <span
                    className={cn('inline-flex items-center justify-center shrink-0 [&>svg]:size-full', resolvedIconClass)}
                    style={typeof iconSize === 'number' ? { width: iconSize, height: iconSize } : undefined}
                >
                    {icon}
                </span>
            )}
            {children != null && <span className={cn('truncate', contentClassName)}>{children}</span>}
            {icon && iconPosition === 'right' && (
                <span
                    className={cn('inline-flex items-center justify-center shrink-0 [&>svg]:size-full', resolvedIconClass)}
                    style={typeof iconSize === 'number' ? { width: iconSize, height: iconSize } : undefined}
                >
                    {icon}
                </span>
            )}
        </Component>
    );
}) as unknown as PillComponent;
