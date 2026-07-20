import * as React from 'react';

export type GuardFn = (ctx: { from: string; to: string }) => boolean | Promise<boolean>;

export interface TabDescriptor {
    id?: string;
    label: string;
    className?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    renderLabel?: (active: boolean) => React.ReactNode;
    onBeforeLeave?: GuardFn;
}

export type TabsInput = Array<string | TabDescriptor>;
export type TabsVariant = 'underline' | 'block';
export type TabsSize = 'xs' | 'sm' | 'md';
export type TabsOverflow = 'scroll' | 'dropdown' | 'both';

export interface TabsProps {
    tabs: TabsInput;
    value?: string;
    defaultValue?: string;
    onChange?: (next: string) => void;
    onBeforeChange?: GuardFn;
    variant?: TabsVariant;
    size?: TabsSize;
    overflow?: TabsOverflow;

    scrollBehavior?: 'smooth' | 'auto';
    scrollStep?: number | 'half' | 'page';
    arrowTransitionDuration?: string;
    moreLabel?: React.ReactNode;

    listClassName?: string;
    listContainerClassName?: string;
    tabClassName?: string;
    contentClassName?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface NormalizedTab extends TabDescriptor {
    id: string;
}

export interface TabsGuardContextValue {
    registerGuard(tabId: string, fn: GuardFn): void;
    unregisterGuard(tabId: string, fn: GuardFn): void;
    contentClassName?: string;
}
