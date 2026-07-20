import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type TextVariant =
    | 'banner'
    | 'title'
    | 'subtitle'
    | 'heading'
    | 'subheading'
    | 'lead'
    | 'large'
    | 'body'
    | 'small'
    | 'caption'
    | 'muted'
    | 'code';

export type IconPos = 'left' | 'right';

const defaultElementMap: Record<TextVariant, React.ElementType> = {
    banner: 'div',
    title: 'h1',
    subtitle: 'p',
    heading: 'h2',
    subheading: 'h3',
    lead: 'p',
    large: 'div',
    body: 'p',
    small: 'small',
    caption: 'span',
    muted: 'span',
    code: 'code',
};

export const textVariants = cva('text-foreground', {
    variants: {
        variant: {
            banner: 'block font-extrabold capitalize text-4xl lg:text-5xl xl:text-6xl leading-[42px] lg:leading-[50px] xl:leading-[60px] tracking-tight',
            title: 'block text-3xl sm:text-4xl font-bold tracking-tight leading-tight',
            subtitle: 'block text-lg text-muted-foreground leading-normal',
            heading: 'block text-2xl font-semibold tracking-tight',
            subheading: 'block text-xl font-medium tracking-tight',
            lead: 'text-xl text-muted-foreground leading-normal',
            large: 'text-lg font-semibold',
            body: 'leading-7 text-base',
            small: 'text-sm font-medium leading-none',
            caption: 'text-xs text-muted-foreground font-medium',
            muted: 'text-sm text-muted-foreground',
            code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground',
        },
    },
    defaultVariants: {
        variant: 'body',
    },
});

type StringOrNumber = string | number;
type ElementType = React.ElementType;

export interface TextBaseProps {
    variant?: TextVariant;
    
    // Semantics
    label?: boolean;
    button?: boolean;

    // Inline overrides
    size?: StringOrNumber;
    weight?: StringOrNumber;
    italic?: boolean;
    center?: boolean;

    // Helpers
    upper?: boolean;
    capitalise?: boolean;
    noSelect?: boolean;

    // Color
    color?: string;

    // Linkability
    href?: string;
    link?: string; // alias

    // Icon support
    icon?: React.ReactNode;
    iconPos?: IconPos;
    iconClass?: string;
    onIconClick?: (e: React.MouseEvent) => void;
    gap?: number;

    // Number / currency formatting
    currency?: string;
    format?: Intl.NumberFormatOptions;
    thousandSeparator?: boolean | string;
    prefix?: string;
    suffix?: string;

    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

type AsProp<E extends ElementType> = { as?: E; asChild?: boolean };
type PropsToOmit<E extends ElementType, P> = keyof (AsProp<E> & P);
type PolymorphicProps<E extends ElementType, P> = P & AsProp<E> & Omit<React.ComponentPropsWithoutRef<E>, PropsToOmit<E, P>>;
type PolymorphicRef<E extends ElementType> = React.ComponentPropsWithRef<E>['ref'];

export type TextProps<E extends ElementType = 'span'> = PolymorphicProps<E, TextBaseProps>;

function formatNumber(
    value: React.ReactNode,
    options: {
        currency?: string;
        format?: Intl.NumberFormatOptions;
        thousandSeparator?: boolean | string;
        prefix?: string;
        suffix?: string;
    }
): React.ReactNode {
    if (value == null) return '';

    let num: number | null = null;
    if (typeof value === 'number') {
        num = value;
    } else if (typeof value === 'string') {
        const cleaned = value.replace(/[^0-9.-]/g, '');
        const parsed = Number(cleaned);
        if (!Number.isNaN(parsed) && cleaned !== '') {
            num = parsed;
        }
    }

    if (num === null) return value;

    const { currency, format, thousandSeparator, prefix = '', suffix = '' } = options;

    const numberFormatOptions: Intl.NumberFormatOptions = {
        useGrouping: thousandSeparator !== false,
        ...format,
    };

    if (currency) {
        numberFormatOptions.style = 'currency';
        numberFormatOptions.currency = currency;
    }

    try {
        const formatted = new Intl.NumberFormat(undefined, numberFormatOptions).format(num);
        return `${prefix}${formatted}${suffix}`;
    } catch {
        return value;
    }
}

function TextImpl<E extends ElementType = 'span'>(
    {
        as,
        asChild,
        className,
        style,
        children,
        variant = 'body',

        // Semantics
        label,
        button,

        // Inline overrides
        size,
        weight,
        italic,
        center,

        // Helpers
        upper,
        capitalise,
        noSelect,

        // Color
        color,

        // Linkability
        href,
        link,

        // Icons
        icon,
        iconPos = 'left',
        iconClass,
        onIconClick,
        gap = 8,

        // Formatting
        currency,
        format,
        thousandSeparator,
        prefix,
        suffix,

        ...rest
    }: TextProps<E>,
    ref: PolymorphicRef<E>
) {
    const effectiveHref = href ?? link;

    // Pick HTML tag element
    const Component: React.ElementType = asChild
        ? Slot
        : as
        ? as
        : effectiveHref
        ? 'a'
        : button
        ? 'button'
        : label
        ? 'label'
        : defaultElementMap[variant] ?? 'span';

    const textStyle: React.CSSProperties = {
        ...style,
        ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {}),
        ...(weight ? { fontWeight: weight as React.CSSProperties['fontWeight'] } : {}),
        ...(color ? { color } : {}),
    };

    const helperClass = cn(
        italic && 'italic',
        center && 'text-center',
        upper && 'uppercase',
        capitalise && 'capitalize',
        noSelect && 'select-none'
    );

    const maybeFormatted =
        currency || format || thousandSeparator !== undefined
            ? formatNumber(children, { currency, format, thousandSeparator, prefix, suffix })
            : children;

    const content = icon ? (
        <span className="inline-flex items-center" style={{ gap: `${gap}px` }}>
            {iconPos === 'left' && (
                <span className={cn('inline-flex items-center shrink-0', iconClass)} onClick={onIconClick}>
                    {icon}
                </span>
            )}
            <span>{maybeFormatted}</span>
            {iconPos === 'right' && (
                <span className={cn('inline-flex items-center shrink-0', iconClass)} onClick={onIconClick}>
                    {icon}
                </span>
            )}
        </span>
    ) : (
        <>{maybeFormatted}</>
    );

    return (
        <Component
            ref={ref as any}
            href={effectiveHref as any}
            className={cn(textVariants({ variant }), helperClass, className)}
            style={textStyle}
            {...rest}
        >
            {content}
        </Component>
    );
}

type TextComponent = <E extends ElementType = 'span'>(props: TextProps<E>) => React.ReactElement | null;
const TextInner = React.forwardRef(TextImpl as any);
TextInner.displayName = 'Text';
export const Text = TextInner as unknown as TextComponent;
