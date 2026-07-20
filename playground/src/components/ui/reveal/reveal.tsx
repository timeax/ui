'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import * as React from 'react';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type CollapseAt = BreakpointKey | number;

const BREAKPOINTS: Record<BreakpointKey, number> = {
    xs: 568,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

function resolveBreakpoint(value?: CollapseAt): number | undefined {
    if (value == null) return undefined;
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
    return BREAKPOINTS[value as BreakpointKey];
}

export type RevealProps = {
    children: React.ReactNode;
    icon?: React.ReactNode;
    collapseAt?: CollapseAt;
    className?: string;
    buttonClassName?: string;
    contentClassName?: string;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    closeOnOutsideClick?: boolean;
    closeOnEscape?: boolean;
    disabled?: boolean;
    title?: string;
    keepOpenWhenExpanded?: boolean;
    width?: number | string;
    variant?: 'relative' | 'absolute';
    side?: 'left' | 'right';
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'>;

export function Reveal({
    children,
    icon,
    collapseAt,
    className,
    buttonClassName,
    contentClassName,
    defaultOpen = false,
    open,
    onOpenChange,
    onClick,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    disabled = false,
    title = 'Toggle',
    keepOpenWhenExpanded = true,
    width = '20rem',
    variant = 'relative',
    side = 'right',
    ...buttonProps
}: RevealProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const breakpointValue = resolveBreakpoint(collapseAt);
    const isCollapsedViewport = useIsMobile(breakpointValue ?? 768);

    // no collapseAt => always compact/reveal mode
    const shouldCollapse = collapseAt == null ? true : isCollapsedViewport;

    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const setOpen = React.useCallback(
        (next: boolean) => {
            if (!isControlled) {
                setInternalOpen(next);
            }
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
    );

    const handleButtonClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(e);
            if (disabled || e.defaultPrevented) return;
            setOpen(!isOpen);
        },
        [onClick, disabled, isOpen, setOpen],
    );

    React.useEffect(() => {
        if (!shouldCollapse) {
            if (keepOpenWhenExpanded) setOpen(true);
            return;
        }

        if (!defaultOpen && !isControlled) {
            setInternalOpen(false);
        }
    }, [shouldCollapse, keepOpenWhenExpanded, defaultOpen, isControlled, setOpen]);

    React.useEffect(() => {
        if (!shouldCollapse || !closeOnEscape) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [shouldCollapse, closeOnEscape, setOpen]);

    React.useEffect(() => {
        if (!shouldCollapse || !closeOnOutsideClick || !isOpen) return;

        const onPointerDown = (e: MouseEvent | TouchEvent) => {
            const el = containerRef.current;
            const target = e.target as Node | null;

            if (!el || !target) return;
            if (!el.contains(target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('touchstart', onPointerDown);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('touchstart', onPointerDown);
        };
    }, [shouldCollapse, closeOnOutsideClick, isOpen, setOpen]);

    if (!shouldCollapse) {
        return <div className={cn('min-w-0', className)}>{children}</div>;
    }

    const resolvedWidth = typeof width === 'number' ? `${width}px` : width;

    return (
        <div ref={containerRef} className={cn('relative inline-flex max-w-full items-center', variant === 'relative' && 'gap-2', className)}>
            <button
                type="button"
                title={title}
                aria-label={buttonProps['aria-label'] ?? title}
                aria-expanded={isOpen}
                disabled={disabled}
                onClick={handleButtonClick}
                className={cn(
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background text-foreground transition',
                    'hover:bg-accent hover:text-accent-foreground',
                    'disabled:pointer-events-none disabled:opacity-50',
                    buttonClassName,
                )}
                {...buttonProps}
            >
                {icon ?? <Search className="h-4 w-4" />}
            </button>

            <div
                className={cn(
                    variant === 'absolute'
                        ? cn(
                              'absolute top-1/2 z-50 min-w-0 -translate-y-1/2 overflow-hidden transition-all duration-200 ease-in-out',
                              side === 'left' ? 'right-full mr-2' : 'left-full ml-2',
                              isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
                          )
                        : cn(
                              'min-w-0 overflow-hidden transition-all duration-200 ease-in-out',
                              isOpen ? 'pointer-events-auto ml-1 opacity-100' : 'pointer-events-none ml-0 w-0 opacity-0',
                          ),
                    contentClassName,
                )}
                style={
                    isOpen
                        ? {
                              width: `min(${resolvedWidth}, calc(100vw - 5rem))`,
                          }
                        : undefined
                }
            >
                <div className="min-w-0 w-full">{children}</div>
            </div>
        </div>
    );
}
