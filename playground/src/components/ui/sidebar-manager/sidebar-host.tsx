import * as React from 'react';
import type { SidebarComponent, SidebarSide, SidebarSize } from './sidebar-manager.types';

export type RegisteredSidebar<TProps = any, TResult = unknown> = {
    component: SidebarComponent<TProps, TResult>;
    mountProps?: Partial<TProps> & {
        title?: React.ReactNode;
        description?: React.ReactNode;
        side?: SidebarSide;
        size?: SidebarSize;
        className?: string;
        uid?: string;
        promise?: boolean;
        onClose?(result?: { resolved: boolean; data?: TResult }): void;
    };
};

export type SidebarHostProps = {
    sidebars?: Record<string, RegisteredSidebar<any, any>> | Array<RegisteredSidebar<any, any> | SidebarComponent<any, any>>;
};

export function SidebarHost({ sidebars }: SidebarHostProps) {
    if (!sidebars) return null;

    const list = React.useMemo(() => {
        if (Array.isArray(sidebars)) {
            return sidebars.map((item, idx) => {
                if (item && typeof item === 'object' && 'component' in item) {
                    return {
                        key: (item.component as any).id ?? `sidebar-host-item-${idx}`,
                        component: item.component,
                        mountProps: item.mountProps,
                    };
                }
                return {
                    key: (item as any).id ?? `sidebar-host-item-${idx}`,
                    component: item as SidebarComponent<any, any>,
                    mountProps: undefined,
                };
            });
        }
        return Object.entries(sidebars).map(([id, item]) => {
            return {
                key: id,
                component: item.component,
                mountProps: item.mountProps,
            };
        });
    }, [sidebars]);

    return (
        <>
            {list.map((item) => {
                const Comp = item.component;
                return <Comp key={item.key} {...(item.mountProps as any)} />;
            })}
        </>
    );
}
SidebarHost.displayName = 'SidebarHost';
