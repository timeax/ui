import * as React from 'react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../empty';
import { cn } from '@/lib/utils';

export type EmptyLayout = 'vertical' | 'horizontal';
export type EmptyAlign = 'start' | 'center';

export interface EmptySlots {
    root?: React.HTMLAttributes<HTMLDivElement>;
    header?: React.HTMLAttributes<HTMLDivElement>;
    media?: React.HTMLAttributes<HTMLDivElement>;
    title?: React.HTMLAttributes<HTMLHeadingElement>;
    description?: React.HTMLAttributes<HTMLParagraphElement>;
    content?: React.HTMLAttributes<HTMLDivElement>;
}

export interface EmptyMeta {
    title: string | React.ReactNode;
    description?: string | React.ReactNode;
    icon?: React.ReactNode | (() => React.ReactNode);
    mediaVariant?: 'default' | 'icon';
    hideMedia?: boolean;
    iconWrapperClassName?: string;
    iconClassName?: string;
    action?: React.ReactNode;
    renderContent?: () => React.ReactNode;
    layout?: EmptyLayout;
    align?: EmptyAlign;
    gapClassName?: string;
    contentGapClassName?: string;
    kicker?: React.ReactNode;
    kickerClassName?: string;
    className?: string;
    headerClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    contentClassName?: string;
    slots?: EmptySlots;
    before?: React.ReactNode;
    after?: React.ReactNode;
    wrapper?: (node: React.ReactNode) => React.ReactNode;
}

export function isEmpty(value: unknown): boolean {
    if (value == null) return true;
    if (Array.isArray(value)) return value.length === 0;

    switch (typeof value) {
        case 'string':
            return value.trim().length === 0;
        case 'object': {
            if (value instanceof Map || value instanceof Set) return value.size === 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof (value as any)?.length === 'number') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return ((value as any).length as number) === 0;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof (value as any)?.size === 'number') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return ((value as any).size as number) === 0;
            }
            return Object.keys(value as object).length === 0;
        }
        default:
            return false;
    }
}

function nodeOf(icon?: EmptyMeta['icon']) {
    const v = typeof icon === 'function' ? icon() : icon;
    return v ?? null;
}

type Content<T> = React.ReactNode | ((data: NonNullable<T>) => React.ReactNode);

export function renderIf<T>(data: T, content: Content<T>, empty: EmptyMeta): React.ReactNode {
    if (!isEmpty(data)) {
        return typeof content === 'function' ? (content as (d: T) => React.ReactNode)(data) : content;
    }

    const {
        className,
        headerClassName,
        contentClassName,
        titleClassName,
        descriptionClassName,
        gapClassName = 'gap-2',
        contentGapClassName = 'gap-3',
        align = 'center',
        layout = 'vertical',
        mediaVariant = 'icon',
        iconWrapperClassName,
        iconClassName,
        hideMedia,
        wrapper,
        before,
        after,
        kicker,
        kickerClassName,
        slots,
    } = empty;

    const iconEl = nodeOf(empty.icon);
    const contentBlock = empty.renderContent?.() ?? empty.action ?? null;

    const alignCls = align === 'start' ? 'items-start text-left' : 'items-center text-center';
    const layoutCls = layout === 'horizontal' ? 'md:grid md:grid-cols-[auto,1fr] md:items-start md:gap-4' : '';

    const EmptyNode = (
        <Empty {...slots?.root} className={cn('p-3 sm:p-5', className, slots?.root?.className)}>
            {before}

            <EmptyHeader
                {...slots?.header}
                className={cn('flex flex-col', gapClassName, alignCls, layoutCls, headerClassName, slots?.header?.className)}
            >
                {!hideMedia && iconEl && (
                    <EmptyMedia {...slots?.media} className={cn(iconWrapperClassName, slots?.media?.className)} variant={mediaVariant}>
                        {React.isValidElement(iconEl)
                            ? React.cloneElement(iconEl as React.ReactElement, {
                                  // @ts-ignore
                                  className: cn((iconEl as any).props?.className, iconClassName),
                              })
                            : iconEl}
                    </EmptyMedia>
                )}

                <div className={cn(layout === 'horizontal' ? 'md:mt-1' : '')}>
                    {kicker && <div className={cn('text-xs tracking-wide text-muted-foreground uppercase', kickerClassName)}>{kicker}</div>}
                    {empty.title && (
                        <EmptyTitle {...slots?.title} className={cn(titleClassName, slots?.title?.className, "max-md:text-md!")}>
                            {empty.title}
                        </EmptyTitle>
                    )}
                    {empty.description && (
                        <EmptyDescription {...slots?.description} className={cn(descriptionClassName, slots?.description?.className, 'mt-1 text-md')}>
                            {empty.description}
                        </EmptyDescription>
                    )}
                </div>
            </EmptyHeader>

            {after}

            {contentBlock && (
                <EmptyContent {...slots?.content} className={cn('flex flex-col', contentGapClassName, contentClassName, slots?.content?.className)}>
                    {contentBlock}
                </EmptyContent>
            )}
        </Empty>
    );

    return wrapper ? wrapper(EmptyNode) : EmptyNode;
}

export function RenderIf<T>({ data, empty, children }: { data: T; empty: EmptyMeta; children: Content<T> }) {
    return <>{renderIf<T>(data, children, empty)}</>;
}
