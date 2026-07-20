import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';

/* =========================================================================
 * Context & Types
 * ========================================================================= */

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;

const DEFAULT_TW_BREAKPOINTS: Record<string, number> = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

interface ToolboxContextValue {
    registerCollapsedItem: (id: string, node: React.ReactNode, bp: Breakpoint) => void;
    unregisterCollapsedItem: (id: string) => void;
    collapsedItems: Array<{ id: string; node: React.ReactNode; bp: Breakpoint }>;
    breakpoints: Record<string, number>;
}

const ToolboxContext = React.createContext<ToolboxContextValue | null>(null);

function useToolbox() {
    const context = React.useContext(ToolboxContext);
    if (!context) {
        throw new Error('Toolbox sub-components must be used within a <Toolbox> root.');
    }
    return context;
}

function getResponsiveClasses(bp: Breakpoint) {
    const prefix = bp.startsWith('[') ? `min-${bp}` : bp;
    return {
        inline: `hidden ${prefix}:flex`,
        menu: `${prefix}:hidden`,
    };
}

function resolveBreakpointPx(
    bp: Breakpoint,
    breakpoints: Record<string, number>,
    rootFontSize: number
): number | null {
    if (bp in breakpoints) return breakpoints[bp];

    const m = bp.match(/^\[(\d+(?:\.\d+)?)(px|rem|em)\]$/);
    if (m) {
        const value = Number(m[1]);
        const unit = m[2];
        if (!Number.isFinite(value)) return null;

        if (unit === 'px') return value;
        return value * rootFontSize;
    }

    return null;
}

function useMinWidthMatches(
    bps: Breakpoint[],
    breakpoints: Record<string, number>
): Record<string, boolean | undefined> {
    const [matches, setMatches] = React.useState<Record<string, boolean | undefined>>({});

    const key = React.useMemo(() => {
        const uniq = Array.from(new Set(bps)).sort();
        return uniq.join('|');
    }, [bps]);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const rootFontSize =
            Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize || '16') || 16;

        const uniq = Array.from(new Set(bps)).sort();
        const entries: Array<{
            bp: Breakpoint;
            mql: MediaQueryList;
            onChange: () => void;
        }> = [];

        for (const bp of uniq) {
            const px = resolveBreakpointPx(bp, breakpoints, rootFontSize);
            if (px == null) continue;

            const query = `(min-width: ${px}px)`;
            const mql = window.matchMedia(query);

            const onChange = () => {
                setMatches((prev) => {
                    if (prev[bp] === mql.matches) return prev;
                    return { ...prev, [bp]: mql.matches };
                });
            };

            onChange();

            if ('addEventListener' in mql) {
                mql.addEventListener('change', onChange);
            } else {
                (mql as any).addListener(onChange);
            }

            entries.push({ bp, mql, onChange });
        }

        return () => {
            for (const { mql, onChange } of entries) {
                if ('removeEventListener' in mql) {
                    mql.removeEventListener('change', onChange);
                } else {
                    (mql as any).removeListener(onChange);
                }
            }
        };
    }, [key, breakpoints]);

    return matches;
}

/* =========================================================================
 * Toolbox Root Component
 * ========================================================================= */

export interface ToolboxProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'row' | 'column';
    breakpoints?: Record<string, number>;
}

const ToolboxRoot = React.forwardRef<HTMLDivElement, ToolboxProps>(
    ({ className, variant = 'row', breakpoints, children, ...props }, ref) => {
        const [collapsedItems, setCollapsedItems] = React.useState<ToolboxContextValue['collapsedItems']>([]);

        const registerCollapsedItem = React.useCallback((id: string, node: React.ReactNode, bp: Breakpoint) => {
            setCollapsedItems((prev) => {
                if (prev.find((item) => item.id === id)) return prev;
                return [...prev, { id, node, bp }];
            });
        }, []);

        const unregisterCollapsedItem = React.useCallback((id: string) => {
            setCollapsedItems((prev) => prev.filter((item) => item.id !== id));
        }, []);

        const bpMap = breakpoints ?? DEFAULT_TW_BREAKPOINTS;

        return (
            <ToolboxContext.Provider
                value={{ collapsedItems, registerCollapsedItem, unregisterCollapsedItem, breakpoints: bpMap }}
            >
                <div
                    ref={ref}
                    className={cn(
                        'flex w-full items-center gap-2',
                        variant === 'column' ? 'flex-col items-stretch' : 'flex-row',
                        className
                    )}
                    {...props}
                >
                    {children}
                </div>
            </ToolboxContext.Provider>
        );
    }
);
ToolboxRoot.displayName = 'Toolbox';

/* =========================================================================
 * Toolbox Item (collapses at breakpoint)
 * ========================================================================= */

export interface ToolboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
    grow?: boolean;
    collapseAt?: Breakpoint;
    menuLabel?: string;
}

const ToolboxItem = React.forwardRef<HTMLDivElement, ToolboxItemProps>(
    ({ className, grow = false, collapseAt, menuLabel, children, ...props }, ref) => {
        const { registerCollapsedItem, unregisterCollapsedItem } = useToolbox();
        const id = React.useId();

        React.useEffect(() => {
            if (!collapseAt) return;

            const menuNode = (
                <DropdownMenuItem asChild>
                    <div className="flex w-full items-center">
                        {menuLabel ? <span className="mr-2 text-muted-foreground font-medium">{menuLabel}</span> : null}
                        {children}
                    </div>
                </DropdownMenuItem>
            );

            registerCollapsedItem(id, menuNode, collapseAt);
            return () => unregisterCollapsedItem(id);
        }, [collapseAt, id, menuLabel, registerCollapsedItem, unregisterCollapsedItem]);

        const responsive = collapseAt ? getResponsiveClasses(collapseAt) : { inline: '', menu: '' };

        return (
            <div
                ref={ref}
                className={cn('flex items-center', grow ? 'flex-grow' : 'flex-grow-0', responsive.inline, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);
ToolboxItem.displayName = 'Toolbox.Item';

/* =========================================================================
 * Toolbox Group (collapses as a single group)
 * ========================================================================= */

export interface ToolboxGroupProps extends ToolboxItemProps {
    separator?: boolean;
}

const ToolboxGroup = React.forwardRef<HTMLDivElement, ToolboxGroupProps>(
    ({ className, collapseAt, separator, children, ...props }, ref) => {
        const { registerCollapsedItem, unregisterCollapsedItem } = useToolbox();
        const id = React.useId();

        React.useEffect(() => {
            if (!collapseAt) return;

            const menuNode = (
                <div className="flex flex-col gap-1 w-full">
                    {separator && <DropdownMenuSeparator />}
                    <div className="flex flex-col gap-1 p-1">{children}</div>
                </div>
            );

            registerCollapsedItem(id, menuNode, collapseAt);
            return () => unregisterCollapsedItem(id);
        }, [collapseAt, id, separator, registerCollapsedItem, unregisterCollapsedItem]);

        const responsive = collapseAt ? getResponsiveClasses(collapseAt) : { inline: '', menu: '' };

        return (
            <div
                ref={ref}
                className={cn('flex items-center gap-2', responsive.inline, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);
ToolboxGroup.displayName = 'Toolbox.Group';

/* =========================================================================
 * Toolbox Menu (Dropdown list of collapsed items)
 * ========================================================================= */

export const ToolboxMenu = () => {
    const { collapsedItems = [], breakpoints } = useToolbox();

    const bps = React.useMemo(() => Array.from(new Set(collapsedItems.map((i) => i.bp))), [collapsedItems]);
    const matchesMin = useMinWidthMatches(bps, breakpoints);

    const activeItems = React.useMemo(() => {
        return collapsedItems.filter((item) => matchesMin[item.bp] !== true);
    }, [collapsedItems, matchesMin]);

    if (activeItems.length === 0) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                {activeItems.map((item) => {
                    const responsive = getResponsiveClasses(item.bp);
                    return (
                        <div key={item.id} className={cn('w-full', responsive.menu)}>
                            {item.node}
                        </div>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
ToolboxMenu.displayName = 'Toolbox.Menu';

/* =========================================================================
 * Compound Assign
 * ========================================================================= */

export const Toolbox = Object.assign(ToolboxRoot, {
    Item: ToolboxItem,
    Group: ToolboxGroup,
    Menu: ToolboxMenu,
});

export default Toolbox;
