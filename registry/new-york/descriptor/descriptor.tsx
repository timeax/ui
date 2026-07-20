import { Text } from '@/components/ui/text';
import type { TextBaseProps as TextOpts } from '@/components/ui/text';
import Visual from '@/components/ui/visual';
import type { VisualProps } from '@/components/ui/visual';
import { cn } from '@/lib/utils';
import * as React from 'react';

type Dir = 'row' | 'row-reverse' | 'col' | 'col-reverse';
type Break = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type DirectionAt = Partial<Record<Break, Dir>>;
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

type DividerPlacement = 'none' | 'top' | 'bottom' | 'both' | 'around';

export interface DescriptorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Body content (for prop-based usage) */
    title?: React.ReactNode | ((slot: { compact: boolean }) => React.ReactNode);
    subtitle?: React.ReactNode | ((slot: { compact: boolean }) => React.ReactNode);

    /** Leading visuals (for prop-based usage) */
    leadingVisual?: VisualProps;
    leading?: React.ReactNode;
    leadingClassName?: string;
    leadingSize?: number | string;

    /** Trailing (right-side) lines (for prop-based usage) */
    trailingPrimary?: React.ReactNode;
    trailingSecondary?: React.ReactNode;
    trailingClassName?: string;
    trailingLinesGap?: number | string; // default 4
    trailingAs?: 'inline' | 'stack'; // default 'stack'

    /** Layout & spacing */
    direction?: Dir; // default 'row'
    directionAt?: DirectionAt; // responsive overrides
    gap?: number | string; // gap between content cluster ↔ trailing (default 8)
    innerGap?: number | string; // gap inside body title↔subtitle (default 4)
    contentGap?: number | string; // gap between Leading ↔ Body (defaults to innerGap)
    justify?: Justify; // default 'between'
    align?: Align; // default: rows 'center' / cols 'start'
    wrap?: boolean;
    compact?: boolean;
    density?: 'compact' | 'cozy' | 'spacious'; // preset paddings & gaps

    /** Dividers */
    divider?: DividerPlacement; // default 'none'
    dividerInset?: number | string; // left/right inset for horizontal lines
    dividerClassName?: string; // extra classes for the divider line

    /** Title/subtitle Text passthrough */
    titleText?: Partial<TextOpts>;
    subtitleText?: Partial<TextOpts>;
    trailingText?: Partial<TextOpts>;
    /** Optional per-line overrides for trailing text */
    trailingPrimaryText?: Partial<TextOpts>;
    trailingSecondaryText?: Partial<TextOpts>;

    /** Semantics / interactivity */
    as?: React.ElementType; // default 'div' (or 'a' when href)
    href?: string;
    onClick?: React.MouseEventHandler;
    disabled?: boolean;
    roleButton?: boolean;

    /** Slots */
    renderLeading?: () => React.ReactNode;
    renderBody?: () => React.ReactNode;
    renderTrailing?: () => React.ReactNode;

    /** Wrapper class for Leading + Body */
    contentClassName?: string;
}

type DescriptorContextValue = {
    density: 'compact' | 'cozy' | 'spacious';
    bodyGap: string;
    trailGap: string;
};

const DescriptorContext = React.createContext<DescriptorContextValue | null>(null);

/* ---------- helpers ---------- */
const dirToClass = (d?: Dir) =>
    d === 'row'
        ? 'flex-row'
        : d === 'row-reverse'
          ? 'flex-row-reverse'
          : d === 'col'
            ? 'flex-col'
            : d === 'col-reverse'
              ? 'flex-col-reverse'
              : undefined;

const justifyToClass = (j?: Justify) =>
    j === 'start'
        ? 'justify-start'
        : j === 'center'
          ? 'justify-center'
          : j === 'end'
            ? 'justify-end'
            : j === 'around'
              ? 'justify-around'
              : j === 'evenly'
                ? 'justify-evenly'
                : 'justify-between';

const alignToClass = (a?: Align, isCol?: boolean) => {
    if (!a) return isCol ? 'items-start' : 'items-center';
    return a === 'start'
        ? 'items-start'
        : a === 'center'
          ? 'items-center'
          : a === 'end'
            ? 'items-end'
            : a === 'baseline'
              ? 'items-baseline'
              : 'items-stretch';
};

const responsiveDirClasses = (at?: DirectionAt) =>
    at
        ? Object.entries(at)
              .map(([br, dir]) => `${br}:${dirToClass(dir)}`)
              .join(' ')
        : undefined;

const toPx = (v?: number | string) => (typeof v === 'number' ? `${v}px` : v);

/** Density presets for vertical padding and default gaps */
function densityPreset(d?: DescriptorProps['density']) {
    switch (d) {
        case 'compact':
            return { py: 'py-1', rowGap: 6, innerGap: 2, trailingGap: 2 };
        case 'spacious':
            return { py: 'py-4', rowGap: 12, innerGap: 6, trailingGap: 6 };
        case 'cozy':
        default:
            return { py: 'py-2', rowGap: 8, innerGap: 4, trailingGap: 4 };
    }
}

/* ---------- main component ---------- */
export const Descriptor = React.forwardRef<HTMLDivElement, DescriptorProps>(function Descriptor(
    {
        children,
        // body
        title,
        subtitle,

        // leading
        leadingVisual,
        leading,
        leadingClassName,
        leadingSize,

        // trailing
        trailingPrimary,
        trailingSecondary,
        trailingClassName,
        trailingLinesGap,
        trailingAs = 'stack',

        // layout
        direction = 'row',
        directionAt,
        gap,
        innerGap,
        contentGap,
        justify = 'between',
        align,
        wrap,
        compact,
        density = 'cozy',

        // dividers
        divider = 'none',
        dividerInset,
        dividerClassName,

        // text forwarding
        titleText,
        subtitleText,
        trailingText,
        trailingPrimaryText,
        trailingSecondaryText,

        // semantics
        as,
        href,
        onClick,
        disabled,
        roleButton,

        // slots
        renderLeading,
        renderBody,
        renderTrailing,

        // classes
        contentClassName,

        className,
        style,
        ...rest
    },
    ref,
) {
    const Container: React.ElementType = as ?? (href ? 'a' : 'div');
    const isCol = direction.startsWith('col');
    const dClass = dirToClass(direction);
    const dResp = responsiveDirClasses(directionAt);

    const d = densityPreset(density);
    const outerGap = toPx(gap ?? d.rowGap); // content cluster ↔ trailing
    const bodyGap = toPx(innerGap ?? d.innerGap); // Title ↔ Subtitle
    const contentGapPx = toPx(contentGap ?? d.innerGap); // Leading ↔ Body
    const trailGap = toPx(trailingLinesGap ?? d.trailingGap);

    const containerProps: any = {
        ref,
        className: cn(
            'flex',
            dClass,
            dResp,
            justifyToClass(justify),
            alignToClass(align, isCol),
            wrap && 'flex-wrap',
            disabled && 'pointer-events-none opacity-60 select-none',
            d.py,
            className,
        ),
        style: { gap: outerGap, ...style },
        onClick,
        href,
        'aria-disabled': disabled || undefined,
        role: roleButton ? 'button' : rest.role,
        tabIndex: roleButton ? 0 : (rest as any).tabIndex,
        ...rest,
    };

    const renderTitle = () => (typeof title === 'function' ? title({ compact: !!compact || density === 'compact' }) : title);
    const renderSubtitle = () => (typeof subtitle === 'function' ? subtitle({ compact: !!compact || density === 'compact' }) : subtitle);

    /* LEADING */
    const Leading = renderLeading ? (
        renderLeading()
    ) : leadingVisual || leading ? (
        <div className={cn('flex items-center shrink-0', leadingClassName)} data-section="leading">
            {leadingVisual ? <Visual {...leadingVisual} size={leadingVisual.size ?? leadingSize} /> : leading}
        </div>
    ) : null;

    /* BODY */
    const Body = renderBody ? (
        renderBody()
    ) : (
        <div className={cn('min-w-0 flex grow flex-col')} style={{ gap: bodyGap }} data-section="body">
            {renderTitle() != null && (
                <Text size={14} weight={700} dark {...titleText}>
                    {renderTitle()}
                </Text>
            )}
            {renderSubtitle() != null && (
                <Text variant="small" {...subtitleText} className={cn('min-w-0', subtitleText?.className)}>
                    {renderSubtitle()}
                </Text>
            )}
        </div>
    );

    /* TRAILING */
    const Trailing = renderTrailing ? (
        renderTrailing()
    ) : trailingPrimary || trailingSecondary ? (
        <div
            className={cn(trailingAs === 'stack' ? 'flex flex-col text-right' : 'flex flex-row items-center', trailingClassName)}
            style={{ gap: trailGap }}
            data-section="trailing"
        >
            {trailingPrimary != null && (
                <Text {...trailingText} {...trailingPrimaryText}>
                    {trailingPrimary}
                </Text>
            )}
            {trailingSecondary != null && (
                <Text {...trailingText} {...trailingSecondaryText}>
                    {trailingSecondary}
                </Text>
            )}
        </div>
    ) : null;

    /* DIVIDERS */
    const Line: React.FC<{ pos: 'top' | 'bottom' }> = ({ pos }) => (
        <div
            aria-hidden
            className={cn('pointer-events-none', dividerClassName ?? 'border-t border-border/80 dark:border-border/30')}
            style={{
                marginLeft: toPx(dividerInset),
                marginRight: toPx(dividerInset),
                ...(pos === 'top' ? { marginBottom: outerGap } : { marginTop: outerGap }),
            }}
        />
    );

    /* CONTENT WRAPPER (Leading + Body) */
    const Content = (
        <div
            className={cn('min-w-0 flex', dirToClass(direction), responsiveDirClasses(directionAt), contentClassName)}
            style={{ gap: contentGapPx }}
            data-section="content"
        >
            {Leading}
            {Body}
        </div>
    );

    const contextValue = React.useMemo(() => ({
        density,
        bodyGap,
        trailGap,
    }), [density, bodyGap, trailGap]);

    return (
        <DescriptorContext.Provider value={contextValue}>
            {(divider === 'top' || divider === 'both' || divider === 'around') && <Line pos="top" />}

            <Container {...containerProps}>
                {children ? children : (
                    <>
                        {Content}
                        {Trailing}
                    </>
                )}
            </Container>

            {(divider === 'bottom' || divider === 'both' || divider === 'around') && <Line pos="bottom" />}
        </DescriptorContext.Provider>
    );
});
Descriptor.displayName = 'Descriptor';

/* ---------- compound components ---------- */
export const DescriptorLeading = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('flex items-center shrink-0', className)}
                data-section="leading"
                {...props}
            >
                {children}
            </div>
        );
    }
);
DescriptorLeading.displayName = 'DescriptorLeading';

export const DescriptorBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, style, ...props }, ref) => {
        const ctx = React.useContext(DescriptorContext);
        const gap = ctx ? ctx.bodyGap : '4px';
        return (
            <div
                ref={ref}
                className={cn('min-w-0 flex grow flex-col', className)}
                style={{ gap, ...style }}
                data-section="body"
                {...props}
            >
                {children}
            </div>
        );
    }
);
DescriptorBody.displayName = 'DescriptorBody';

export const DescriptorTitle = React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof Text>
>(({ className, children, ...props }, ref) => {
    return (
        <Text
            ref={ref as any}
            size={14}
            weight={700}
            dark
            className={className}
            {...props}
        >
            {children}
        </Text>
    );
});
DescriptorTitle.displayName = 'DescriptorTitle';

export const DescriptorDescription = React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof Text>
>(({ className, children, ...props }, ref) => {
    return (
        <Text
            ref={ref as any}
            variant="small"
            className={cn('min-w-0', className)}
            {...props}
        >
            {children}
        </Text>
    );
});
DescriptorDescription.displayName = 'DescriptorDescription';

export interface DescriptorTrailingProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: 'inline' | 'stack';
}

export const DescriptorTrailing = React.forwardRef<HTMLDivElement, DescriptorTrailingProps>(
    ({ className, children, style, as = 'stack', ...props }, ref) => {
        const ctx = React.useContext(DescriptorContext);
        const gap = ctx ? ctx.trailGap : '4px';
        return (
            <div
                ref={ref}
                className={cn(
                    as === 'stack' ? 'flex flex-col text-right' : 'flex flex-row items-center',
                    className
                )}
                style={{ gap, ...style }}
                data-section="trailing"
                {...props}
            >
                {children}
            </div>
        );
    }
);
DescriptorTrailing.displayName = 'DescriptorTrailing';
