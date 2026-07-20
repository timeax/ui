import * as React from 'react';
import { getSidebarStore } from './sidebar-store';
import type {
    SidebarComponent,
    SidebarContextValue,
    SidebarTriggerHandler,
    SidebarTriggerOptions,
} from './sidebar-manager.types';

// Module augmentation interface for consumer registration
export interface Register {}

export type SidebarId = keyof Register extends never ? string : keyof Register;

export type InferProps<K extends SidebarId> = keyof Register extends never
    ? any
    : K extends keyof Register
        ? (Register[K] extends SidebarComponent<infer P, any> ? P : any)
        : any;

export type InferResult<K extends SidebarId> = keyof Register extends never
    ? any
    : K extends keyof Register
        ? (Register[K] extends SidebarComponent<any, infer R> ? R : any)
        : any;

type TriggerEvent = React.SyntheticEvent | MouseEvent | KeyboardEvent | undefined | null;

function isPlainObject(v: unknown): v is Record<string, any> {
    return !!v && typeof v === 'object' && !Array.isArray(v);
}

function isTriggerOptions(v: unknown): v is {
    props?: any;
    uid?: string;
    preventDefault?: boolean;
    stopPropagation?: boolean;
} {
    if (!isPlainObject(v)) return false;
    const allowed = new Set(['props', 'uid', 'preventDefault', 'stopPropagation']);
    const keys = Object.keys(v);
    if (keys.length === 0) return false;
    for (const k of keys) {
        if (!allowed.has(k)) return false;
    }
    return true;
}

function safePreventDefault(e: any) {
    try {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
    } catch {}
}

function safeStopPropagation(e: any) {
    try {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    } catch {}
}

const SidebarCtx = React.createContext<SidebarContextValue | null>(null);

export const SidebarProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const store = getSidebarStore();

    const ctx = React.useMemo<SidebarContextValue>(
        () => ({
            // @ts-ignore
            open(idOrComp, props, uid) {
                return store.open(idOrComp as any, props, uid);
            },
            update(idOrComp, props, uid) {
                store.update(idOrComp as any, props, uid);
            },
            hide(idOrComp, uid) {
                store.hide(idOrComp as any, uid);
            },
            close(idOrComp, uid) {
                store.close(idOrComp as any, uid);
            },

            // @ts-ignore
            trigger(idOrComp, a, b, c) {
                const asOpts = isTriggerOptions(a);
                const opts = (asOpts ? (a ?? {}) : (c ?? {})) as any;
                const propsArg = asOpts ? undefined : a;
                const uidArg = asOpts ? undefined : b;

                const preventDefault = opts.preventDefault ?? false;
                const stopPropagation = opts.stopPropagation ?? false;

                return (e?: TriggerEvent) => {
                    if (preventDefault) safePreventDefault(e);
                    if (stopPropagation) safeStopPropagation(e);

                    const uid = (opts.uid ?? uidArg) as string | undefined;
                    const rawProps = opts.props ?? propsArg;
                    const props = typeof rawProps === 'function' ? (rawProps as any)(e) : rawProps;

                    store.open(idOrComp as any, props, uid);
                };
            },

            _register(ctrl) {
                store.register(ctrl as any);
            },
            _unregister(id, uid) {
                store.unregister(id, uid);
            },
        }),
        [store]
    );

    return <SidebarCtx.Provider value={ctx}>{children}</SidebarCtx.Provider>;
};
SidebarProvider.displayName = 'SidebarProvider';

export function useSidebar() {
    const base = React.useContext(SidebarCtx);
    if (!base) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }

    // OPEN overloads
    function open<K extends SidebarId>(
        id: K,
        props?: Partial<InferProps<K>>,
        uid?: string
    ): Promise<InferResult<K>> | void;
    function open<P, R>(
        comp: SidebarComponent<P, R>,
        props?: Partial<P>,
        uid?: string
    ): Promise<R> | void;
    function open(idOrComp: any, props?: any, uid?: string) {
        return base.open(idOrComp, props, uid) as any;
    }

    // UPDATE overloads
    function update<K extends SidebarId>(
        id: K,
        props: Partial<InferProps<K>>,
        uid?: string
    ): void;
    function update<P>(
        comp: SidebarComponent<P, any>,
        props: Partial<P>,
        uid?: string
    ): void;
    function update(idOrComp: any, props: any, uid?: string) {
        return base.update(idOrComp, props, uid);
    }

    const hide = base.hide;
    const close = base.close;
    const trigger = base.trigger;

    return { open, update, hide, close, trigger };
}

export function useSidebarInternal() {
    const base = React.useContext(SidebarCtx);
    if (!base) {
        throw new Error('useSidebarInternal must be used within SidebarProvider');
    }
    return base;
}
