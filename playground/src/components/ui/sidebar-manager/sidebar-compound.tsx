import * as React from 'react';
import { cn } from '@/lib/utils';
import { SidebarParentContext } from './create-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type {
    SidebarWrapperProps,
    SidebarHeaderProps,
    SidebarContentProps,
    SidebarFooterProps,
    SidebarTitleProps,
    SidebarCloseProps,
    SidebarLayoutContextValue,
} from './sidebar-manager.types';

export const SidebarLayoutContext = React.createContext<SidebarLayoutContextValue | null>(null);

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
            <path
                fillRule="evenodd"
                d="M10 8.586 4.293 2.879 2.879 4.293 8.586 10l-5.707 5.707 1.414 1.414L10 11.414l5.707 5.707 1.414-1.414L11.414 10l5.707-5.707-1.414-1.414L10 8.586Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

/**
 * SidebarWrapper — the root of a compound sidebar layout.
 *
 * Internally uses CSS Grid with three named rows:
 *   Row 1 (auto)         → SidebarHeader
 *   Row 2 (minmax(0,1fr))→ SidebarContent  ← the scroll zone
 *   Row 3 (auto)         → SidebarFooter
 */
export const SidebarWrapper = React.forwardRef<HTMLDivElement, SidebarWrapperProps>(
    ({ children, className, style, ...props }, ref) => {
        const parentCtx = React.useContext(SidebarParentContext);

        const contextValue = React.useMemo<SidebarLayoutContextValue>(() => ({
            title: parentCtx?.title,
            open: parentCtx?.open ?? false,
            close: parentCtx?.close ?? (() => {}),
        }), [parentCtx]);

        return (
            <SidebarLayoutContext.Provider value={contextValue}>
                <div
                    ref={ref}
                    data-slot="sidebar-wrapper"
                    className={cn('h-full w-full min-h-0', className)}
                    style={{
                        display: 'grid',
                        gridTemplateRows: 'auto minmax(0, 1fr) auto',
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </div>
            </SidebarLayoutContext.Provider>
        );
    }
);
SidebarWrapper.displayName = 'SidebarWrapper';

/** Row 1 of the compound grid — always auto-sized. */
export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
    ({ children, className, style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                data-slot="sidebar-header"
                className={cn('flex flex-col gap-2 p-6 pb-4 border-b', className)}
                style={{ gridRow: 1, ...style }}
                {...props}
            >
                {children}
            </div>
        );
    }
);
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarTitle = React.forwardRef<HTMLHeadingElement, SidebarTitleProps>(
    ({ className, ...props }, ref) => {
        const ctx = React.useContext(SidebarLayoutContext);
        if (!ctx) {
            throw new Error('SidebarTitle must be used within a SidebarWrapper');
        }

        if (!ctx.title) return null;

        return (
            <h2
                ref={ref}
                data-slot="sidebar-title"
                className={cn('text-lg leading-none font-semibold tracking-tight', className)}
                {...props}
            >
                {ctx.title}
            </h2>
        );
    }
);
SidebarTitle.displayName = 'SidebarTitle';

export const SidebarClose = React.forwardRef<HTMLButtonElement, SidebarCloseProps>(
    ({ className, ...props }, ref) => {
        const ctx = React.useContext(SidebarLayoutContext);
        if (!ctx) {
            throw new Error('SidebarClose must be used within a SidebarWrapper');
        }

        return (
            <button
                ref={ref}
                type="button"
                data-slot="sidebar-close"
                onClick={ctx.close}
                aria-label="Close sidebar"
                className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:cursor-pointer transition-colors',
                    className
                )}
                {...props}
            >
                <CloseIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </button>
        );
    }
);
SidebarClose.displayName = 'SidebarClose';

/**
 * Row 2 of the compound grid — the scrollable content zone.
 *
 * The grid gives this row a definite height (minmax(0, 1fr)).
 * ScrollArea with height:100% fills it exactly.
 */
export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
    ({ children, className, innerClassName }, ref) => {
        return (
            <div
                ref={ref}
                data-slot="sidebar-content"
                className={cn('overflow-hidden', className)}
                style={{ gridRow: 2 }}
            >
                <ScrollArea style={{ height: '100%' }}>
                    <div className={cn('p-6', innerClassName)}>
                        {children}
                    </div>
                </ScrollArea>
            </div>
        );
    }
);
SidebarContent.displayName = 'SidebarContent';

/** Row 3 of the compound grid — always auto-sized. */
export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
    ({ children, className, style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                data-slot="sidebar-footer"
                className={cn('flex justify-end gap-3 p-6 pt-4 border-t', className)}
                style={{ gridRow: 3, ...style }}
                {...props}
            >
                {children}
            </div>
        );
    }
);
SidebarFooter.displayName = 'SidebarFooter';
