import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
    Trash2,
    ExternalLink,
    Download,
    CheckCircle2,
    XCircle,
    Edit,
    MoreHorizontal,
} from 'lucide-react';

/* =========================================================================
 * Interface Types
 * ========================================================================= */

export interface ActionItem {
    name: string;
    action?: (event?: React.MouseEvent<HTMLElement>) => void | Promise<void>;
    icon?: React.ReactNode;
    children?: ActionItem[];
    disabled?: boolean;
    show?: boolean;
    danger?: boolean;
    className?: string;
}

export interface ActionsProps {
    items: ActionItem[];
    className?: string;
    stopPropagation?: boolean;
    mode?: 'row' | 'toolbar';
}

export interface ActionsToolbarProps {
    selectedCount: number;
    items: ActionItem[];
    className?: string;
    selectedLabel?: string;
    emptyContent?: React.ReactNode;
}

/* =========================================================================
 * Fallback Icon Inference (Lucide-based)
 * ========================================================================= */

function pickFallbackIcon(item: ActionItem): React.ReactNode {
    const name = String(item.name ?? '')
        .toLowerCase()
        .trim();

    if ((item.children?.length ?? 0) > 0) {
        return <MoreHorizontal className="h-4 w-4" />;
    }
    if (item.danger || /(delete|remove|destroy|revoke|archive|detach)/.test(name)) {
        return <Trash2 className="h-4 w-4" />;
    }
    if (/(view|open|show|details|inspect|preview)/.test(name)) {
        return <ExternalLink className="h-4 w-4" />;
    }
    if (/(export|download)/.test(name)) {
        return <Download className="h-4 w-4" />;
    }
    if (/(activate|enable|approve|restore|assign|link|sync)/.test(name)) {
        return <CheckCircle2 className="h-4 w-4" />;
    }
    if (/(deactivate|disable|block|reject|unlink|pause|stop)/.test(name)) {
        return <XCircle className="h-4 w-4" />;
    }
    return <Edit className="h-4 w-4" />;
}

function normalizeItems(items: ActionItem[]): ActionItem[] {
    return (items ?? [])
        .filter((item) => item && item.show !== false)
        .map((item): ActionItem => {
            const children: ActionItem[] = normalizeItems(item.children ?? []);
            return {
                ...item,
                children,
                icon: item.icon ?? pickFallbackIcon({ ...item, children }),
            };
        });
}

function stopRowPropagation(enabled: boolean, event: React.MouseEvent<HTMLElement>) {
    if (!enabled) return;
    event.stopPropagation();
}

/* =========================================================================
 * Sub-Components (Row, Dropdown, Toolbar Buttons)
 * ========================================================================= */

function RowActionButton({ item, stopPropagation }: { item: ActionItem; stopPropagation: boolean }) {
    const button = (
        <Button
            variant="ghost"
            size="icon"
            disabled={item.disabled}
            className={cn(
                'h-8 w-8',
                item.danger && 'text-destructive hover:bg-destructive/10 hover:text-destructive',
                item.className
            )}
            onClick={(event) => {
                stopRowPropagation(stopPropagation, event);
                item.action?.(event);
            }}
        >
            {item.icon}
            <span className="sr-only">{item.name}</span>
        </Button>
    );

    return (
        <TooltipProvider>
            <Tooltip delayDuration={250}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="top">
                    <p>{item.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function RowActionDropdown({ item, stopPropagation }: { item: ActionItem; stopPropagation: boolean }) {
    const children = item.children ?? [];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 w-8 data-[state=open]:bg-muted', item.className)}
                    onClick={(event) => stopRowPropagation(stopPropagation, event)}
                >
                    {item.icon ?? <MoreHorizontal className="h-4 w-4" />}
                    <span className="sr-only">{item.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {item.name ? (
                    <>
                        <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                    </>
                ) : null}
                {children.map((child, index) => (
                    <DropdownMenuItem
                        key={`${child.name}-${index}`}
                        disabled={child.disabled}
                        className={cn(
                            'flex cursor-pointer items-center gap-2',
                            child.danger && 'text-destructive focus:bg-destructive/10 focus:text-destructive',
                            child.className
                        )}
                        onClick={(event) => {
                            stopRowPropagation(stopPropagation, event);
                            child.action?.(event);
                        }}
                    >
                        {child.icon ? <span className="text-muted-foreground">{child.icon}</span> : null}
                        <span>{child.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function ToolbarButton({ item }: { item: ActionItem }) {
    const iconOnlyClass = cn('h-8 w-8 p-0', item.className);

    if (item.children && item.children.length > 0) {
        const children = item.children;

        return (
            <TooltipProvider>
                <Tooltip delayDuration={250}>
                    <DropdownMenu>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={item.disabled}
                                    className={cn('data-[state=open]:bg-muted', iconOnlyClass)}
                                >
                                    {item.icon}
                                    <span className="sr-only">{item.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {children.map((child, index) => (
                                <DropdownMenuItem
                                    key={`${child.name}-${index}`}
                                    disabled={child.disabled}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2',
                                        child.danger && 'text-destructive focus:bg-destructive/10 focus:text-destructive',
                                        child.className
                                    )}
                                    onClick={(event) => child.action?.(event)}
                                >
                                    {child.icon ? <span className="text-muted-foreground">{child.icon}</span> : null}
                                    <span>{child.name}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TooltipContent side="top">
                        <p>{item.name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={250}>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        variant={item.danger ? 'destructive' : 'outline'}
                        disabled={item.disabled}
                        className={iconOnlyClass}
                        onClick={(event) => item.action?.(event)}
                    >
                        {item.icon}
                        <span className="sr-only">{item.name}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>{item.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

/* =========================================================================
 * Core Actions Components
 * ========================================================================= */

const ActionsRoot: React.FC<ActionsProps> = ({ items, className, stopPropagation = true, mode = 'row' }) => {
    const visibleItems = normalizeItems(items);
    if (visibleItems.length === 0) return null;

    if (mode === 'toolbar') {
        return (
            <div className={cn('flex flex-wrap items-center gap-2', className)}>
                {visibleItems.map((item, index) => (
                    <ToolbarButton key={`${item.name}-${index}`} item={item} />
                ))}
            </div>
        );
    }

    return (
        <div className={cn('flex items-center justify-end gap-1', className)}>
            {visibleItems.map((item, index) => {
                if (item.children && item.children.length > 0) {
                    return (
                        <RowActionDropdown
                            key={`${item.name}-${index}`}
                            item={item}
                            stopPropagation={stopPropagation}
                        />
                    );
                }

                return (
                    <RowActionButton
                        key={`${item.name}-${index}`}
                        item={item}
                        stopPropagation={stopPropagation}
                    />
                );
            })}
        </div>
    );
};

const ActionsToolbar: React.FC<ActionsToolbarProps> = ({
    selectedCount,
    items,
    className,
    selectedLabel = 'selected',
    emptyContent,
}) => {
    if (selectedCount < 1) return emptyContent ? <>{emptyContent}</> : null;

    return (
        <div className={cn('flex flex-wrap items-center gap-3', className)}>
            <div className="text-sm text-muted-foreground font-medium">
                {selectedCount} {selectedLabel}
            </div>
            <ActionsRoot items={items} mode="toolbar" stopPropagation={false} />
        </div>
    );
};

export const Actions = Object.assign(ActionsRoot, {
    Toolbar: ActionsToolbar,
});

export default Actions;
