import * as React from 'react';

export type SidebarSide = 'left' | 'right' | 'top' | 'bottom';
export type SidebarSize = 'sm' | 'default' | 'lg' | 'xl' | 'full' | string | number;

export type SidebarController<TResult = unknown, TProps = unknown> = {
    id: string;
    uid?: string;
    open: (props?: Partial<TProps>) => Promise<TResult> | void;
    update: (props: Partial<TProps>) => void;
    hide: (resolve?: boolean) => void;
    setData: (data: unknown) => void;
    readonly data: unknown;
};

export type SidebarComponent<TProps, TResult> = React.FC<SidebarAttachedProps<TProps, TResult>> & { id: string };

export type SidebarAttachedProps<TProps, TResult> = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
    uid?: string;
    side?: SidebarSide;
    size?: SidebarSize;
    promise?: boolean;
    onClose?(result?: { resolved: boolean; data?: TResult }): void;
} & TProps;

export type SidebarContextValue = {
    open<TResult = unknown, TProps = any>(
        idOrComp: string | SidebarComponent<TProps, TResult>,
        props?: Partial<TProps & { onSidebarClose?(): void }>,
        uid?: string
    ): Promise<TResult> | undefined;

    update<TProps = unknown>(
        idOrComp: string | SidebarComponent<TProps, unknown>,
        props: Partial<TProps>,
        uid?: string
    ): void;

    hide(idOrComp: string | { id: string }, uid?: string): void;
    close(idOrComp: string | { id: string }, uid?: string): void;

    trigger<TResult = unknown, TProps = unknown>(
        idOrComp: string | SidebarComponent<TProps, TResult>,
        props?: Partial<TProps>,
        uid?: string,
        opts?: Omit<SidebarTriggerOptions<TProps>, 'props' | 'uid'>
    ): SidebarTriggerHandler;

    trigger<TResult = unknown, TProps = unknown>(
        idOrComp: string | SidebarComponent<TProps, TResult>,
        opts?: SidebarTriggerOptions<TProps>
    ): SidebarTriggerHandler;

    _register(ctrl: SidebarController<any, any>): void;
    _unregister(id: string, uid?: string): void;
};

export type SidebarTriggerOptions<TProps> = {
    props?: Partial<TProps & { onSidebarClose?(): void }>;
    uid?: string;
    preventDefault?: boolean;
    stopPropagation?: boolean;
};

export type SidebarTriggerHandler = (e?: React.MouseEvent<HTMLElement> | MouseEvent | React.SyntheticEvent) => void;

/* ─────────────────────────────────────────────
 * Compound Layout Context & Types
 * ───────────────────────────────────────────── */

export type SidebarLayoutContextValue = {
    title?: React.ReactNode;
    open: boolean;
    close: () => void;
};

export type SidebarWrapperProps = React.ComponentPropsWithoutRef<'div'>;

export type SidebarHeaderProps = React.ComponentPropsWithoutRef<'div'>;

export type SidebarContentProps = {
    children?: React.ReactNode;
    /** Classes applied to the outer cell container */
    className?: string;
    /** Classes applied to the inner padding wrapper inside ScrollArea */
    innerClassName?: string;
};

export type SidebarFooterProps = React.ComponentPropsWithoutRef<'div'>;

export type SidebarTitleProps = {
    className?: string;
    children?: never;
};

export type SidebarCloseProps = {
    className?: string;
    children?: never;
};
