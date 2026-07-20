'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { useSidebarInternal } from './sidebar-provider';
import type {
    SidebarAttachedProps,
    SidebarComponent,
    SidebarController,
    SidebarSide,
    SidebarSize,
    SidebarLayoutContextValue,
} from './sidebar-manager.types';

export const SidebarParentContext = React.createContext<SidebarLayoutContextValue | null>(null);

type SizeToClass = (side: SidebarSide, size?: SidebarSize) => { className: string; style?: React.CSSProperties };

const sizeToClass: SizeToClass = (side, size = 'default') => {
    const isHorizontal = side === 'left' || side === 'right';

    const horizontalMap: Record<string, string> = {
        sm: 'w-screen max-w-screen sm:w-64',
        default: 'w-screen max-w-screen sm:w-80',
        lg: 'w-screen max-w-screen sm:w-96',
        xl: 'w-screen max-w-screen sm:w-[28rem]',
        full: 'w-screen max-w-screen',
    };

    const verticalMap: Record<string, string> = {
        sm: 'h-56',
        default: 'h-72',
        lg: 'h-96',
        xl: 'h-[28rem]',
        full: 'h-screen',
    };

    const map = isHorizontal ? horizontalMap : verticalMap;

    const numeric = typeof size === 'number' ? size : typeof size === 'string' && /^\d+$/.test(size) ? Number(size) : null;

    if (numeric && Number.isFinite(numeric) && numeric > 0) {
        return {
            className: isHorizontal ? 'w-screen max-w-screen sm:w-auto' : '',
            style: isHorizontal ? { width: `min(100vw, ${numeric}px)` } : { height: `${numeric}px` },
        };
    }

    if (typeof size === 'string' && (size.startsWith('w-') || size.startsWith('h-'))) {
        if (isHorizontal) {
            return {
                className: `w-screen max-w-screen sm:${size}`,
            };
        }

        return { className: size };
    }

    return { className: map[size] ?? map.default };
};

export function createSidebar<TProps, TResult = unknown>(
    id: string,
    render: (ctx: {
        props: TProps;
        hide: (resolve?: boolean, data?: TResult) => void;
        setData: (d: unknown) => void;
        show(props?: TProps): void;
        update(props: Partial<TProps>): void;
        open: boolean;
    }) => React.ReactNode,
): SidebarComponent<TProps, TResult> {
    const Comp: React.FC<SidebarAttachedProps<TProps, TResult>> = (p) => {
        const { className, uid, promise, onClose, side = 'right', size, ...rest } = p as any;

        const [open, setOpen] = React.useState(false);
        const [merged, setMerged] = React.useState<TProps & { title?: React.ReactNode; description?: React.ReactNode; onSidebarClose?(): void }>(rest);
        const dataRef = React.useRef<unknown>(undefined);
        const sidebar = useSidebarInternal();

        const displayedTitle = React.useMemo(() => merged.title, [merged.title]);
        const displayedDescription = React.useMemo(() => merged.description, [merged.description]);

        const ctrl: SidebarController<TResult, TProps> = React.useMemo(() => {
            const c: SidebarController<TResult, TProps> = {
                id,
                uid,
                open: (next) => {
                    if (next) setMerged((m) => ({ ...m, ...next }));
                    setOpen(true);
                    if (promise) {
                        return new Promise<TResult>((resolve, reject) => {
                            c.hide = (ok?: boolean) => {
                                setOpen(false);
                                onClose?.({ resolved: !!ok, data: dataRef.current as TResult });
                                ok ? resolve((dataRef.current as TResult) ?? (undefined as any)) : reject(new Error('cancelled'));
                            };
                        });
                    }
                },
                update: (next) => setMerged((m) => ({ ...m, ...next })),
                hide: (ok) => {
                    setOpen(false);
                    merged.onSidebarClose?.();
                    onClose?.({ resolved: !!ok, data: dataRef.current as TResult });
                },
                setData: (d) => {
                    dataRef.current = d;
                },
                get data() {
                    return dataRef.current;
                },
            };
            return c;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [uid, promise, onClose, merged.onSidebarClose]);

        React.useEffect(() => {
            sidebar._register(ctrl);
            return () => sidebar._unregister(id, uid);
        }, [sidebar, ctrl, uid]);

        const hide = React.useCallback(
            (ok?: boolean, data?: TResult) => {
                if (data !== undefined) ctrl.setData(data);
                ctrl.hide(!!ok);
            },
            [ctrl],
        );

        const { className: sizeClass, style: sizeStyle } = sizeToClass(side, size);

        const updateProps = React.useCallback((next: Partial<TProps>) => ctrl.update(next), [ctrl]);

        const showAgain = React.useCallback(
            (next?: Partial<TProps>) => {
                if (!open) ctrl.open(next);
                else if (next) ctrl.update(next);
            },
            [ctrl, open],
        );

        const renderResult = render({
            props: merged,
            hide,
            setData: ctrl.setData,
            update: updateProps as any,
            show: showAgain,
            open,
        });

        let isCustomLayout = false;
        if (React.isValidElement(renderResult)) {
            let type: any = renderResult.type;
            while (type && typeof type === 'object' && 'type' in type) {
                type = type.type;
            }
            isCustomLayout = type?.displayName === 'SidebarWrapper' || type?.name === 'SidebarWrapper';
        }

        return (
            <SidebarParentContext.Provider value={{ title: displayedTitle, open, close: () => hide(false) }}>
                <Sheet open={open} onOpenChange={(o) => !o && hide(false)}>
                    <SheetContent
                        side={side}
                        style={sizeStyle}
                        className={cn(sizeClass, isCustomLayout ? 'p-0 gap-0 [&>button]:hidden' : 'p-6 gap-6', className)}
                    >
                        {!isCustomLayout && (displayedTitle || displayedDescription) && (
                            <SheetHeader className="py-3 px-0">
                                {displayedTitle && <SheetTitle>{displayedTitle}</SheetTitle>}
                                {displayedDescription && <SheetDescription>{displayedDescription}</SheetDescription>}
                            </SheetHeader>
                        )}
                        {renderResult}
                    </SheetContent>
                </Sheet>
            </SidebarParentContext.Provider>
        );
    };

    (Comp as any).id = id;
    return Comp as SidebarComponent<TProps, TResult>;
}
