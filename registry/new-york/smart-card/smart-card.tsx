import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Region = 'header' | 'content' | 'footer' | null;

const RegionCtx = React.createContext<Region>(null);
const ACTION_MARK = Symbol('SmartCardAction');
const REGION_MARK = Symbol('SmartCardRegion');

const smartCardVariants = cva('rounded-xl overflow-hidden', {
    variants: {
        variant: {
            solid: '',
            soft: '',
            outlined: 'border bg-transparent',
            ghost: 'bg-transparent border-none shadow-none',
            'soft-outline': 'border',
            'soft-solid': '',
        },
        level: {
            outer: '',
            inner: '',
        },
    },
    compoundVariants: [
        { variant: 'solid', level: 'outer', class: 'bg-card border' },
        { variant: 'solid', level: 'inner', class: 'bg-muted/40 border-none' },
        { variant: 'soft', level: 'outer', class: 'bg-card shadow-xs border' },
        { variant: 'soft', level: 'inner', class: 'bg-muted/40 shadow-xs border-none' },
        { variant: 'soft-solid', level: 'outer', class: 'bg-card shadow-xs border-none' },
        { variant: 'soft-solid', level: 'inner', class: 'bg-muted/40 shadow-xs border-none' },
        { variant: 'soft-outline', level: 'outer', class: 'bg-card border shadow-xs' },
        { variant: 'soft-outline', level: 'inner', class: 'bg-muted/40 border shadow-xs' },
    ],
    defaultVariants: {
        variant: 'solid',
        level: 'outer',
    },
});

export interface LinkAction {
    text: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
    className?: string;
}

export interface SmartCardProps
    extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'>,
        VariantProps<typeof smartCardVariants> {
    header?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    actionText?: React.ReactNode;
    actionHref?: string;
    actionTarget?: string;
    actionRel?: string;
    actions?: LinkAction | LinkAction[] | React.ReactNode;
    renderAction?: (a: LinkAction, index: number) => React.ReactNode;
    linkComponent?: React.ElementType;
    linkKey?: string;
    contentClassName?: string;
    headerBorder?: boolean;
    density?: 'compact' | 'default' | 'loose';
}

const densityMap = {
    compact: {
        px: 'px-4',
        headerPt: 'pt-3',
        headerPbBorder: 'pb-3',
        headerPbNone: 'pb-0',
        contentPtBorder: 'pt-3',
        contentPtNone: 'pt-0',
        contentPb: 'pb-3',
        standaloneY: 'py-4',
        footerY: 'py-3',
    },
    default: {
        px: 'px-6',
        headerPt: 'pt-4',
        headerPbBorder: 'pb-4',
        headerPbNone: 'pb-1',
        contentPtBorder: 'pt-4',
        contentPtNone: 'pt-1',
        contentPb: 'pb-4',
        standaloneY: 'py-5',
        footerY: 'py-4',
    },
    loose: {
        px: 'px-8',
        headerPt: 'pt-6',
        headerPbBorder: 'pb-6',
        headerPbNone: 'pb-2',
        contentPtBorder: 'pt-6',
        contentPtNone: 'pt-2',
        contentPb: 'pb-6',
        standaloneY: 'py-7',
        footerY: 'py-6',
    },
} as const;

function toArray<T>(v?: T | T[]): T[] {
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
}

function isActionElement(node: React.ReactNode): node is React.ReactElement {
    return !!(
        node &&
        typeof node === 'object' &&
        'type' in node &&
        (node.type as any)?.[ACTION_MARK] === true
    );
}

function getExplicitRegion(node: React.ReactNode): Exclude<Region, null> | null {
    if (!(node && typeof node === 'object' && 'type' in node)) return null;
    return ((node.type as any)?.[REGION_MARK] as Exclude<Region, null> | undefined) ?? null;
}

function extractExplicitRegions(children: React.ReactNode) {
    const arr = React.Children.toArray(children);
    const buckets: Record<Exclude<Region, null>, React.ReactElement[]> = {
        header: [],
        content: [],
        footer: [],
    };
    const other: React.ReactNode[] = [];

    for (const child of arr) {
        const region = getExplicitRegion(child);
        if (region) {
            buckets[region].push(child as React.ReactElement);
            continue;
        }
        other.push(child);
    }

    return {
        ...buckets,
        other,
        hasExplicitRegions:
            buckets.header.length > 0 || buckets.content.length > 0 || buckets.footer.length > 0,
    };
}

function extractTopLevelActions(children: React.ReactNode) {
    const arr = React.Children.toArray(children);
    const hoisted: React.ReactElement[] = [];
    const rest = arr.filter((child) => {
        if (isActionElement(child)) {
            hoisted.push(child as React.ReactElement);
            return false;
        }
        return true;
    });
    return { rest, hoisted };
}

function splitForLayout(
    children: React.ReactNode,
    {
        headerProp,
        footerProp,
        lockHeader,
    }: { headerProp?: React.ReactNode; footerProp?: React.ReactNode; lockHeader: boolean },
) {
    if (lockHeader || headerProp || footerProp) {
        return { header: headerProp ?? null, content: children ?? null, footer: footerProp ?? null };
    }
    const arr = React.Children.toArray(children);
    let header: React.ReactNode = null;
    let content: React.ReactNode = null;
    let footer: React.ReactNode = null;

    if (arr.length === 3) [header, content, footer] = arr;
    else if (arr.length === 2) [content, footer] = arr;
    else content = arr[0] ?? null;

    return { header, content, footer };
}

export function SmartCardAction({ className, ...props }: React.ComponentProps<'div'>) {
    const region = React.useContext(RegionCtx);
    return (
        <CardAction
            className={cn(
                'flex items-center gap-2',
                region === 'header' ? 'ml-auto' : '',
                className
            )}
            {...props}
        />
    );
}
(SmartCardAction as any)[ACTION_MARK] = true;

function markRegion<T extends React.ElementType>(component: T, region: Exclude<Region, null>): T {
    (component as any)[REGION_MARK] = region;
    return component;
}

export const SmartCardHeader = markRegion(CardHeader, 'header');
export const SmartCardContent = markRegion(CardContent, 'content');
export const SmartCardFooter = markRegion(CardFooter, 'footer');

function DefaultActionLink({
    linkKey = 'href',
    LinkComponent = 'a',
    ...a
}: LinkAction & { LinkComponent?: React.ElementType; linkKey?: string }) {
    const linkProps: Record<string, unknown> = { [linkKey]: a.href };
    if (a.target) linkProps.target = a.target;
    if (a.rel) linkProps.rel = a.rel;

    return (
        <SmartCardAction>
            <LinkComponent
                {...linkProps}
                className={cn(
                    'inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline hover:cursor-pointer',
                    a.className
                )}
            >
                {a.text}
            </LinkComponent>
        </SmartCardAction>
    );
}

export const SmartCard = React.forwardRef<HTMLDivElement, SmartCardProps>(
    (
        {
            header,
            title,
            description,
            footer,
            actionText,
            actionHref,
            actionTarget,
            actionRel,
            actions,
            renderAction,
            linkComponent: LinkComponent = 'a',
            linkKey = 'href',
            className,
            variant,
            level,
            children,
            contentClassName,
            headerBorder = false,
            density = 'default',
            ...rest
        },
        ref
    ) => {
        if ((title || description) && header) {
            throw new Error('SmartCard: use either `header` OR (`title`/`description`), not both.');
        }

        const hasAutoHeader = !!(title || description || actionText || toArray(actions).length);

        const propActions = [
            ...(actionText && actionHref
                ? [{ text: actionText, href: actionHref, target: actionTarget, rel: actionRel } as LinkAction]
                : []),
            ...toArray(actions),
        ]
            .filter(Boolean)
            .map((a, i) => {
                const isLinkAction =
                    a && typeof a === 'object' && 'href' in a && 'text' in a && !React.isValidElement(a);

                if (isLinkAction) {
                    return renderAction ? (
                        <React.Fragment key={`__render_action_${i}`}>
                            {renderAction(a as LinkAction, i)}
                        </React.Fragment>
                    ) : (
                        <DefaultActionLink
                            key={`__prop_action_${i}`}
                            {...(a as LinkAction)}
                            LinkComponent={LinkComponent}
                            linkKey={linkKey}
                        />
                    );
                }

                return <React.Fragment key={`__action_node_${i}`}>{a as React.ReactNode}</React.Fragment>;
            });

        const { rest: nonActionChildren, hoisted: childActions } = extractTopLevelActions(children);
        const explicitRegions = extractExplicitRegions(nonActionChildren);

        const fallbackLayout = explicitRegions.hasExplicitRegions
            ? null
            : splitForLayout(nonActionChildren, {
                  headerProp: header,
                  footerProp: footer,
                  lockHeader: !!(title || description),
              });

        const headerContent =
            header ??
            (hasAutoHeader && (
                <div className="flex w-full items-center gap-2 justify-between">
                    <div className="min-w-0">
                        {title && <CardTitle>{title}</CardTitle>}
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    {(childActions.length > 0 || propActions.length > 0) && (
                        <div className="flex items-center gap-2 ml-auto shrink-0">
                            {childActions}
                            {propActions}
                        </div>
                    )}
                </div>
            )) ??
            fallbackLayout?.header;

        const explicitHeader = explicitRegions.header.length > 0 ? <>{explicitRegions.header}</> : null;
        const explicitContent =
            explicitRegions.content.length > 0 ? (
                <>
                    {explicitRegions.content}
                    {explicitRegions.other.length > 0 ? (
                        <CardContent className={contentClassName}>{explicitRegions.other}</CardContent>
                    ) : null}
                </>
            ) : explicitRegions.other.length > 0 ? (
                <CardContent className={contentClassName}>{explicitRegions.other}</CardContent>
            ) : null;
        const explicitFooter = explicitRegions.footer.length > 0 ? <>{explicitRegions.footer}</> : null;

        return (
            <Card
                ref={ref}
                className={cn(smartCardVariants({ variant, level }), className)}
                data-card-level={level}
                {...rest}
            >
                {explicitHeader ? (
                    <RegionCtx.Provider value="header">{explicitHeader}</RegionCtx.Provider>
                ) : headerContent ? (
                    <RegionCtx.Provider value="header">
                        <CardHeader
                            className={cn(
                                densityMap[density].px,
                                densityMap[density].headerPt,
                                headerBorder
                                    ? [densityMap[density].headerPbBorder, 'border-b']
                                    : densityMap[density].headerPbNone
                            )}
                        >
                            {headerContent}
                        </CardHeader>
                    </RegionCtx.Provider>
                ) : null}

                {explicitRegions.hasExplicitRegions ? (
                    explicitContent ? (
                        <RegionCtx.Provider value="content">{explicitContent}</RegionCtx.Provider>
                    ) : null
                ) : (
                    <RegionCtx.Provider value="content">
                        <CardContent
                            className={cn(
                                densityMap[density].px,
                                densityMap[density].contentPb,
                                headerContent
                                    ? (headerBorder
                                        ? densityMap[density].contentPtBorder
                                        : densityMap[density].contentPtNone)
                                    : densityMap[density].standaloneY,
                                contentClassName
                            )}
                        >
                            {fallbackLayout?.content}
                        </CardContent>
                    </RegionCtx.Provider>
                )}

                {explicitRegions.hasExplicitRegions ? (
                    explicitFooter ? (
                        <RegionCtx.Provider value="footer">{explicitFooter}</RegionCtx.Provider>
                    ) : null
                ) : (
                    (fallbackLayout?.footer ?? null) && (
                        <RegionCtx.Provider value="footer">
                            <CardFooter
                                className={cn(
                                    'border-t',
                                    densityMap[density].px,
                                    densityMap[density].footerY
                                )}
                            >
                                {fallbackLayout?.footer}
                            </CardFooter>
                        </RegionCtx.Provider>
                    )
                )}
            </Card>
        );
    }
);

SmartCard.displayName = 'SmartCard';
export default SmartCard;
