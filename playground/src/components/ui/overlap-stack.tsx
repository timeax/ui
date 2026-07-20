import * as React from 'react';
import { cn } from '@/lib/utils';

export type Direction = 'horizontal' | 'vertical';
export type NonZero = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type AsProp<C extends React.ElementType> = { as?: C };
type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);
export type PolymorphicComponentProps<C extends React.ElementType, P> = React.PropsWithChildren<P & AsProp<C>> &
    Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, P>>;

export interface BaseOverlapStackProps {
    /** Layout axis; horizontal uses -space-x-*, vertical uses -space-y-* */
    direction?: Direction;
    /** Negative spacing scale (Tailwind): 0..12; defaults to 3 */
    overlap?: 0 | NonZero;
    /** Reverse the visual order (e.g., right-to-left or bottom-to-top) */
    reverse?: boolean;
    /** If true, sets role="list" on the container for a11y */
    listRole?: boolean;
    className?: string;
}

const H_NEG_SPACE: Record<NonZero, string> = {
    1: '-space-x-1',
    2: '-space-x-2',
    3: '-space-x-3',
    4: '-space-x-4',
    5: '-space-x-5',
    6: '-space-x-6',
    7: '-space-x-7',
    8: '-space-x-8',
    9: '-space-x-9',
    10: '-space-x-10',
    11: '-space-x-11',
    12: '-space-x-12',
};

const V_NEG_SPACE: Record<NonZero, string> = {
    1: '-space-y-1',
    2: '-space-y-2',
    3: '-space-y-3',
    4: '-space-y-4',
    5: '-space-y-5',
    6: '-space-y-6',
    7: '-space-y-7',
    8: '-space-y-8',
    9: '-space-y-9',
    10: '-space-y-10',
    11: '-space-y-11',
    12: '-space-y-12',
};

type OverlapStackComponent = <C extends React.ElementType = 'div'>(
    props: PolymorphicComponentProps<C, BaseOverlapStackProps>
) => React.ReactElement | null;

export const OverlapStack: OverlapStackComponent = React.forwardRef(<C extends React.ElementType = 'div'>(
    props: PolymorphicComponentProps<C, BaseOverlapStackProps>,
    ref: React.Ref<any>
) => {
    const { as, children, className, direction = 'horizontal', overlap = 3, reverse = false, listRole = false, role, ...rest } = props;
    const Component = (as ?? 'div') as React.ElementType;

    const axis = direction === 'horizontal' ? (reverse ? 'flex-row-reverse' : 'flex-row') : reverse ? 'flex-col-reverse' : 'flex-col';

    const overlapClass =
        overlap === 0
            ? direction === 'horizontal'
                ? 'space-x-0'
                : 'space-y-0'
            : direction === 'horizontal'
              ? H_NEG_SPACE[overlap as NonZero]
              : V_NEG_SPACE[overlap as NonZero];

    return (
        <Component
            ref={ref}
            className={cn('isolate flex', axis, overlapClass, className)}
            role={role ?? (listRole ? 'list' : undefined)}
            {...rest}
        >
            {children}
        </Component>
    );
}) as any;
(OverlapStack as any).displayName = 'OverlapStack';

export interface BaseOverlapItemProps {
    /** If true, sets role="listitem" for a11y (pairs with OverlapStack listRole) */
    listItem?: boolean;
    /** Elevate above neighbours on hover/focus for clearer highlights */
    elevateOnHover?: boolean;
    className?: string;
}

type OverlapItemComponent = <C extends React.ElementType = 'div'>(
    props: PolymorphicComponentProps<C, BaseOverlapItemProps>
) => React.ReactElement | null;

export const OverlapItem: OverlapItemComponent = React.forwardRef(<C extends React.ElementType = 'div'>(
    props: PolymorphicComponentProps<C, BaseOverlapItemProps>,
    ref: React.Ref<any>
) => {
    const { as, children, className, listItem = true, elevateOnHover = true, role, ...rest } = props;
    const Component = (as ?? 'div') as React.ElementType;

    return (
        <Component
            ref={ref}
            role={role ?? (listItem ? 'listitem' : undefined)}
            className={cn('relative transition-transform duration-200 ease-out', elevateOnHover && 'focus-within:z-10 hover:z-10 hover:scale-105', className)}
            {...rest}
        >
            {children}
        </Component>
    );
}) as any;
(OverlapItem as any).displayName = 'OverlapItem';

export interface OverlapStackOverflowProps extends React.ComponentPropsWithoutRef<'div'> {
    count: number;
    size?: number | string;
}

export const OverlapStackOverflow = React.forwardRef<HTMLDivElement, OverlapStackOverflowProps>(({
    count,
    size = 32,
    className,
    style,
    ...props
}, ref) => {
    const boxSize = typeof size === 'number' ? `${size}px` : size;

    return (
        <div
            ref={ref}
            className={cn(
                'relative flex items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-background text-xs font-semibold select-none ring-offset-2 ring-primary/20',
                className
            )}
            style={{
                width: boxSize,
                height: boxSize,
                ...style
            }}
            {...props}
        >
            +{count}
        </div>
    );
});
OverlapStackOverflow.displayName = 'OverlapStackOverflow';
