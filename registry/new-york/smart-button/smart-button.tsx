import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Loader2 } from 'lucide-react';

/* =========================================
 * Design tokens
 * ========================================= */

export type Tone = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'theme' | 'white' | 'grey' | 'secondary' | 'neutral';
export type Emphasis = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
export type BtnSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'icon-sm' | 'icon-md' | 'icon-lg' | 'icon-xl' | 'icon-2xl' | 'icon-3xl' | 'icon';

const toneClass: Record<Tone, Record<Emphasis, string>> = {
    primary: {
        solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20',
        outline: 'ring-1 ring-inset ring-primary text-primary hover:bg-primary/10 bg-transparent',
        ghost: 'text-primary hover:bg-primary/10 hover:text-primary',
        link: 'p-0 text-primary underline-offset-4 hover:underline bg-transparent',
    },
    success: {
        solid: 'bg-success text-success-foreground hover:bg-success/90',
        soft: 'bg-success/10 text-success hover:bg-success/20',
        outline: 'ring-1 ring-inset ring-success text-success hover:bg-success/10 bg-transparent',
        ghost: 'text-success hover:bg-success/10',
        link: 'p-0 text-success hover:underline bg-transparent',
    },
    info: {
        solid: 'bg-info text-info-foreground hover:bg-info/90',
        soft: 'bg-info/10 text-info hover:bg-info/20',
        outline: 'ring-1 ring-inset ring-info text-info hover:bg-info/10 bg-transparent',
        ghost: 'text-info hover:bg-info/10',
        link: 'p-0 text-info hover:underline bg-transparent',
    },
    warning: {
        solid: 'bg-warning text-warning-foreground hover:bg-warning/90',
        soft: 'bg-warning/10 text-warning hover:bg-warning/20',
        outline: 'ring-1 ring-inset ring-warning text-warning hover:bg-warning/10 bg-transparent',
        ghost: 'text-warning hover:bg-warning/10',
        link: 'p-0 text-warning hover:underline bg-transparent',
    },
    danger: {
        solid: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        soft: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
        outline: 'ring-1 ring-inset ring-destructive text-destructive hover:bg-destructive/10 bg-transparent',
        ghost: 'text-destructive hover:bg-destructive/10 hover:text-destructive',
        link: 'text-destructive underline-offset-4 hover:underline p-0 bg-transparent',
    },
    theme: {
        solid: 'bg-theme text-theme-foreground border border-input hover:bg-accent hover:text-accent-foreground shadow-xs',
        soft: 'bg-theme/10 text-theme-foreground hover:bg-theme/20',
        outline: 'ring-1 ring-inset ring-theme text-theme-foreground hover:bg-theme/10 bg-transparent',
        ghost: 'text-theme-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'p-0 text-theme-foreground underline-offset-4 hover:underline bg-transparent',
    },
    white: {
        solid: 'bg-white text-white-foreground border border-input shadow-xs hover:bg-accent hover:text-accent-foreground',
        soft: 'bg-white/10 text-white-foreground hover:bg-white/20',
        outline: 'ring-1 ring-inset ring-white text-white-foreground hover:bg-white/10 bg-transparent',
        ghost: 'text-white-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'p-0 text-white-foreground hover:underline bg-transparent',
    },
    grey: {
        solid: 'bg-grey text-grey-foreground hover:bg-grey/90',
        soft: 'bg-grey/10 text-grey-foreground hover:bg-grey/20',
        outline: 'ring-1 ring-inset ring-grey text-grey-foreground hover:bg-grey/10 bg-transparent',
        ghost: 'text-grey-foreground hover:bg-grey/10',
        link: 'p-0 text-grey-foreground hover:underline bg-transparent',
    },
    secondary: {
        solid: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        soft: 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20',
        outline: 'ring-1 ring-inset ring-secondary text-secondary-foreground hover:bg-secondary/10 bg-transparent',
        ghost: 'text-secondary-foreground hover:bg-secondary/10',
        link: 'p-0 text-secondary-foreground underline-offset-4 hover:underline bg-transparent',
    },
    neutral: {
        solid: 'bg-neutral text-neutral-foreground hover:bg-neutral/90',
        soft: 'bg-neutral/10 text-neutral-foreground hover:bg-neutral/20',
        outline: 'ring-1 ring-inset ring-neutral text-neutral-foreground hover:bg-neutral/10 bg-transparent',
        ghost: 'text-neutral-foreground hover:bg-neutral/10',
        link: 'p-0 text-neutral-foreground hover:underline bg-transparent',
    },
};

// container base — includes data-disabled gates (for non-button elements)
const base =
    'inline-flex relative items-center justify-center whitespace-nowrap rounded-md font-medium outline-none hover:cursor-pointer ' +
    'transition-[color,box-shadow,background,opacity,transform] active:scale-[0.98] ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ' +
    // DO NOT let svg sizing affect container
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';

const buttonVariants = cva(base, {
    variants: {
        emphasis: { solid: '', soft: '', outline: '', ghost: '', link: '' },

        // Height caps at h-12; width via px; font scales
        size: {
            sm: 'h-8 px-3 leading-none text-sm gap-1',
            md: 'h-9 px-4 py-2 leading-none text-[0.875rem] gap-1.5',
            lg: 'h-10 px-6 leading-none text-base gap-2',
            xl: 'h-12 px-8 leading-none text-base gap-2.5',
            '2xl': 'h-12 px-10 leading-none text-base gap-3',
            '3xl': 'h-12 px-12 leading-none text-[1.063rem] gap-3.5',

            // icon-only (square)
            'icon-sm': 'size-8 p-0 text-[13px]',
            'icon-md': 'size-9 p-0 text-sm', // alias: icon
            'icon-lg': 'size-10 p-0 text-base',
            'icon-xl': 'size-10 p-0 text-[17px]',
            'icon-2xl': 'size-10 p-0 text-[19px]',
            'icon-3xl': 'size-12 p-0 text-[24px]',

            icon: 'size-9 p-0 text-sm',
        },

        rounding: { md: 'rounded-md', full: 'rounded-full', none: 'rounded-none' },
    },
    defaultVariants: { emphasis: 'solid', size: 'md', rounding: 'md' },
});

export type ButtonStyleProps = VariantProps<typeof buttonVariants> & {
    tone?: Tone;
};

type AsProp<E extends React.ElementType> = {
    as?: E;
};

type PropsOf<E extends React.ElementType> = React.ComponentPropsWithoutRef<E>;

export interface ButtonProps<E extends React.ElementType = 'button'>
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'color'>, ButtonStyleProps, AsProp<E> {
    icon?: React.ReactNode;
    contentClassName?: string;
    iconPosition?: 'left' | 'right';
    /** icon pixels or preset keywords; affects ONLY the icon, not the container */
    iconSize?: number | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    /** gap between icon and text in pixels */
    iconGap?: number | string;
    loading?: boolean;
    roundBy?: number | string;
    /** children become the label (we still manage wrappers internally) */
    children?: React.ReactNode;
}

/* icon size maps (wrapper only) */
const iconByTextBtn: Record<Exclude<BtnSize, 'icon' | 'icon-sm' | 'icon-md' | 'icon-lg' | 'icon-xl' | 'icon-2xl' | 'icon-3xl'>, string> = {
    sm: 'size-4',
    md: 'size-4',
    lg: 'size-5',
    xl: 'size-5',
    '2xl': 'size-5',
    '3xl': 'size-6',
};
const iconPreset: Record<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl', string> = {
    sm: 'size-4',
    md: 'size-4',
    lg: 'size-5',
    xl: 'size-5',
    '2xl': 'size-6',
    '3xl': 'size-7',
};

const InnerButton = React.forwardRef(
    <E extends React.ElementType = 'button'>(
        {
            className,
            contentClassName,
            as,
            tone = 'primary',
            emphasis = 'solid',
            size = 'md',
            rounding = 'md',
            icon,
            iconPosition = 'left',
            iconSize,
            iconGap,
            loading = false,
            roundBy,
            children,
            disabled,
            ...rest
        }: ButtonProps<E> & Omit<PropsOf<E>, keyof ButtonProps>,
        ref: React.Ref<Element>,
    ) => {
        const Comp = (as ?? 'button') as React.ElementType;
        const isIconOnly = !children && !!icon;
        const r = typeof roundBy === 'number' ? `${roundBy}px` : typeof roundBy === 'string' ? roundBy : undefined;

        // compute icon wrapper size (NEVER changes container)
        const iconClass =
            typeof iconSize === 'number'
                ? `w-[${iconSize}px] h-[${iconSize}px]`
                : iconSize
                  ? iconPreset[iconSize]
                  : isIconOnly
                    ? // default for icon-only buttons → match container visual density
                      ((): string => {
                          switch (size as BtnSize) {
                              case 'icon-sm':
                                  return 'size-4';
                              case 'icon': // alias of icon-md
                              case 'icon-md':
                                  return 'size-4';
                              case 'icon-lg':
                                  return 'size-5';
                              case 'icon-xl':
                                  return 'size-5';
                              case 'icon-2xl':
                                  return 'size-6';
                              case 'icon-3xl':
                                  return 'size-7';
                              default:
                                  return 'size-4';
                          }
                      })()
                    : // default for text buttons
                      iconByTextBtn[
                          (size as Exclude<BtnSize, 'icon' | 'icon-sm' | 'icon-md' | 'icon-lg' | 'icon-xl' | 'icon-2xl' | 'icon-3xl'>) ?? 'md'
                      ];

        // if non-button element, emulate disabled via data-attrs so styles still apply
        const nonButton = Comp !== 'button';
        const commonClass = cn(
            buttonVariants({ emphasis, size: isIconOnly ? (size as BtnSize) : (size as BtnSize), rounding }),
            toneClass[tone as Tone][emphasis as Emphasis],
            emphasis === 'link' && 'h-auto p-0',
            className,
        );

        const gapStyle = iconGap ? (typeof iconGap === 'number' ? `${iconGap}px` : iconGap) : undefined;

        const content = (
            <>
                {icon && iconPosition === 'left' && !loading && (
                    <span
                        className={cn('inline-flex items-center justify-center', iconClass)}
                        style={gapStyle ? { marginRight: gapStyle } : undefined}
                    >
                        {icon}
                    </span>
                )}
                {children && <span className={cn(loading && 'opacity-70', contentClassName)}>{children}</span>}
                {icon && iconPosition === 'right' && !loading && (
                    <span
                        className={cn('inline-flex items-center justify-center', iconClass)}
                        style={gapStyle ? { marginLeft: gapStyle } : undefined}
                    >
                        {icon}
                    </span>
                )}
                {loading && (
                    <span
                        className={cn('inline-flex items-center justify-center shrink-0', isIconOnly ? iconClass : 'size-4')}
                        style={!isIconOnly ? (gapStyle ? { marginLeft: gapStyle } : { marginLeft: '0.5rem' }) : undefined}
                    >
                        <Loader2 className="animate-spin size-full" />
                    </span>
                )}
            </>
        );

        if (nonButton) {
            return (
                <Comp
                    ref={ref as any}
                    className={commonClass}
                    style={r ? { borderRadius: r } : undefined}
                    data-disabled={disabled || loading ? '' : undefined}
                    aria-disabled={disabled || loading || undefined}
                    aria-busy={loading || undefined}
                    {...(rest as any)}
                >
                    {content}
                </Comp>
            );
        }

        // native <button>
        return (
            <button
                ref={ref as any}
                className={commonClass}
                style={r ? { borderRadius: r } : undefined}
                disabled={disabled || loading}
                type={(rest as any).type ?? 'button'}
                aria-busy={loading || undefined}
                {...(rest as any)}
            >
                {content}
            </button>
        );
    },
);

InnerButton.displayName = 'Button';

export const Button = InnerButton as <E extends React.ElementType = 'button'>(
    props: ButtonProps<E> & Omit<PropsOf<E>, keyof ButtonProps> & { ref?: React.Ref<Element> },
) => React.JSX.Element;
