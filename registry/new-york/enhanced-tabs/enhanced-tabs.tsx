import * as React from 'react';
import { Tabs as RadixTabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OverflowList } from '@/components/ui/overflow-list';
import { cn } from '@/lib/utils';
import { Check, MoreHorizontal } from 'lucide-react';
import type { TabsProps, NormalizedTab, GuardFn, TabsGuardContextValue } from './enhanced-tabs.types';

function labelToId(label: string): string {
    const spaced = label.replace(/([a-z0-9])([A-Z])/g, '$1_$2');
    return spaced
        .trim()
        .toLowerCase()
        .replace(/[\s\-]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

function normalizeTabs(input: Array<string | { id?: string; label: string }>): NormalizedTab[] {
    return input.map((item) => {
        if (typeof item === 'string') {
            const id = labelToId(item);
            return { id, label: item } as NormalizedTab;
        }
        const id = item.id ?? labelToId(item.label);
        return { ...item, id } as NormalizedTab;
    });
}

const sizeMap: Record<'xs' | 'sm' | 'md', string> = {
    xs: 'px-2 py-1 text-xs h-7',
    sm: 'px-3 py-1 text-sm h-9',
    md: 'px-4 py-2 text-base h-10',
};

const baseTrigger =
    'relative inline-flex items-center gap-2 whitespace-nowrap font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
    'disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

const variantMap: Record<'underline' | 'block', string> = {
    underline: cn(
        'm-0! shadow-none!',
        'bg-transparent! text-muted-foreground hover:text-foreground data-[state=active]:text-foreground',
        'rounded-none! border-b-2! border-transparent!',
        'data-[state=active]:border-primary!',
    ),
    block:
        'border border-transparent border-b-0 -mb-px rounded-t-md ' +
        'text-muted-foreground hover:text-foreground ' +
        'data-[state=active]:bg-background ' +
        'data-[state=active]:border-border ' +
        'data-[state=active]:border-b-background ' +
        'data-[state=active]:text-foreground',
};

const TabsGuardContext = React.createContext<TabsGuardContextValue | null>(null);

function useTabsGuard() {
    const ctx = React.useContext(TabsGuardContext);
    if (!ctx) throw new Error('TabPanel must be used inside Tabs.');
    return ctx;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    value,
    defaultValue,
    onChange,
    onBeforeChange,
    variant = 'block',
    size = 'md',
    overflow = 'scroll',
    scrollBehavior = 'smooth',
    scrollStep = 'half',
    arrowTransitionDuration = 'duration-200',
    moreLabel = <MoreHorizontal className="h-4 w-4" />,
    listClassName,
    listContainerClassName,
    tabClassName,
    contentClassName,
    className,
    children,
}) => {
    const normalizedTabs = React.useMemo(() => normalizeTabs(tabs), [tabs]);
    const firstId = normalizedTabs[0]?.id;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue ?? firstId);
    const currentValue = isControlled ? value : internalValue;
    const effectiveValue = currentValue ?? firstId;

    // Guard mappings
    const tabMap = React.useMemo(() => {
        const map = new Map<string, NormalizedTab>();
        for (const t of normalizedTabs) map.set(t.id, t);
        return map;
    }, [normalizedTabs]);

    const guardsRef = React.useRef<Map<string, Set<GuardFn>>>(new Map());
    
    const registerGuard = React.useCallback((tabId: string, fn: GuardFn) => {
        let set = guardsRef.current.get(tabId);
        if (!set) {
            set = new Set();
            guardsRef.current.set(tabId, set);
        }
        set.add(fn);
    }, []);

    const unregisterGuard = React.useCallback((tabId: string, fn: GuardFn) => {
        const set = guardsRef.current.get(tabId);
        if (!set) return;
        set.delete(fn);
        if (set.size === 0) guardsRef.current.delete(tabId);
    }, []);

    const handleValueChange = React.useCallback(
        async (next: string) => {
            if (!effectiveValue || next === effectiveValue) return;
            const ctx = { from: effectiveValue, to: next };

            // 1. Global change guard
            if (onBeforeChange && (await onBeforeChange(ctx)) === false) return;

            // 2. Tab header custom guard
            const fromTab = tabMap.get(effectiveValue);
            if (fromTab?.onBeforeLeave && (await fromTab.onBeforeLeave(ctx)) === false) return;

            // 3. Tab content custom guard
            const set = guardsRef.current.get(effectiveValue);
            if (set && set.size > 0) {
                for (const fn of set) {
                    if ((await fn(ctx)) === false) return;
                }
            }

            if (!isControlled) setInternalValue(next);
            onChange?.(next);
        },
        [effectiveValue, isControlled, onBeforeChange, onChange, tabMap],
    );

    const guardContext = React.useMemo(
        () => ({ registerGuard, unregisterGuard, contentClassName }),
        [registerGuard, unregisterGuard, contentClassName],
    );

    // ─── OverflowList rendering callbacks ────────────────────────────
    
    const renderTabTrigger = (tab: NormalizedTab, isCollapsed: boolean) => {
        const isActive = effectiveValue === tab.id;
        const triggerContent = tab.renderLabel ? (
            tab.renderLabel(isActive)
        ) : (
            <>
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
            </>
        );

        if (isCollapsed) {
            return (
                <DropdownMenuItem
                    key={tab.id}
                    disabled={tab.disabled}
                    onClick={() => void handleValueChange(tab.id)}
                    className="flex cursor-pointer items-center justify-between"
                >
                    <span className="flex items-center gap-2">{triggerContent}</span>
                    {isActive && <Check className="ml-2 h-4 w-4 text-primary" />}
                </DropdownMenuItem>
            );
        }

        return (
            <TabsTrigger
                key={tab.id}
                value={tab.id}
                disabled={tab.disabled}
                onClick={() => void handleValueChange(tab.id)}
                className={cn(baseTrigger, sizeMap[size], variantMap[variant], tabClassName, tab.className)}
            >
                {triggerContent}
            </TabsTrigger>
        );
    };

    const renderMoreDropdown = (collapsedTabs: NormalizedTab[]) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            baseTrigger,
                            sizeMap[size],
                            variantMap[variant],
                            'text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:cursor-pointer',
                            { 'border-b-transparent': variant === 'underline' }
                        )}
                    >
                        {moreLabel}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
                    {collapsedTabs.map((t) => renderTabTrigger(t, true))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <TabsGuardContext.Provider value={guardContext}>
            <RadixTabs value={effectiveValue} onValueChange={(v: string) => void handleValueChange(v)} className={className}>
                <TabsList
                    className={cn(
                        'flex w-full justify-start border-b border-border bg-transparent',
                        { 'rounded-none p-0': variant === 'underline' },
                        listClassName
                    )}
                >
                    <OverflowList
                        items={normalizedTabs}
                        renderItem={(t) => renderTabTrigger(t, false)}
                        renderMore={renderMoreDropdown}
                        overflow={overflow}
                        scrollBehavior={scrollBehavior}
                        scrollStep={scrollStep}
                        arrowTransitionDuration={arrowTransitionDuration}
                        activeId={effectiveValue}
                        isActive={(t) => t.id === effectiveValue}
                        className="w-full"
                        listContainerClassName={listContainerClassName}
                    />
                </TabsList>
                {children}
            </RadixTabs>
        </TabsGuardContext.Provider>
    );
};
Tabs.displayName = 'Tabs';

export interface TabPanelProps extends Omit<React.ComponentPropsWithoutRef<typeof TabsContent>, 'value'> {
    tabId: string;
    onBeforeLeave?: GuardFn;
}

export const TabPanel: React.FC<TabPanelProps> = ({ tabId, onBeforeLeave, className, ...rest }) => {
    const { registerGuard, unregisterGuard, contentClassName } = useTabsGuard();
    
    React.useEffect(() => {
        if (!onBeforeLeave) return;
        registerGuard(tabId, onBeforeLeave);
        return () => unregisterGuard(tabId, onBeforeLeave);
    }, [onBeforeLeave, registerGuard, unregisterGuard, tabId]);

    return <TabsContent value={tabId} className={cn('mt-4', contentClassName, className)} {...rest} />;
};
TabPanel.displayName = 'TabPanel';
