import { cn } from '@/lib/utils';
import * as React from 'react';
import type {
    FlashPayload,
    MessageActionCore,
    MessagePayload,
} from './feed-renderer.types';
import {
    MessageAction,
    MessageIcon,
    MessageLines,
} from './feed-renderer-parts';

/* =========================================================================
 * Tone / Variant Helpers
 * ========================================================================= */

interface ToneClass {
    container: string;
    accentBar: string;
}

function toneFor(color?: string | null, variant?: string | null): ToneClass {
    const v = (variant ?? '').toLowerCase();
    const c = (color ?? '').toLowerCase();

    const baseContainer =
        'relative overflow-hidden rounded-lg border border-border bg-card-inner text-card-foreground shadow-lg px-3 py-2 sm:px-4 sm:py-3';

    const neutralAccent = 'absolute inset-y-0 left-0 w-1 bg-accent';

    const asSoft = (accent: string, extraContainer?: string): ToneClass => ({
        container: cn(baseContainer, extraContainer),
        accentBar: accent,
    });

    const asSolid = (accent: string, bg: string): ToneClass => ({
        container: cn(
            'relative overflow-hidden rounded-lg border border-transparent px-3 py-2 text-theme-foreground shadow-lg sm:px-4 sm:py-3',
            bg
        ),
        accentBar: accent,
    });

    const isSolid = v === 'solid' || v === 'filled' || v === 'primary';

    switch (c) {
        case 'success': {
            const accent = 'absolute inset-y-0 left-0 w-1 bg-tones-success';
            return isSolid ? asSolid(accent, 'bg-tones-success') : asSoft(accent);
        }
        case 'info': {
            const accent = 'absolute inset-y-0 left-0 w-1 bg-tones-info';
            return isSolid ? asSolid(accent, 'bg-tones-info') : asSoft(accent);
        }
        case 'warning': {
            const accent = 'absolute inset-y-0 left-0 w-1 bg-tones-warning';
            return isSolid ? asSolid(accent, 'bg-tones-warning') : asSoft(accent);
        }
        case 'error':
        case 'destructive': {
            const accent = 'absolute inset-y-0 left-0 w-1 bg-destructive';
            return isSolid ? asSolid(accent, 'bg-destructive') : asSoft(accent);
        }
        case 'primary': {
            const accent = 'absolute inset-y-0 left-0 w-1 bg-primary';
            return isSolid ? asSolid(accent, 'bg-primary') : asSoft(accent);
        }
        case 'white':
            return {
                container: cn(baseContainer, 'bg-card'),
                accentBar: neutralAccent,
            };
        case 'grey':
            return {
                container: cn(baseContainer, 'bg-surfaces-input'),
                accentBar: neutralAccent,
            };
        default:
            return isSolid
                ? asSolid(neutralAccent, 'bg-theme')
                : {
                      container: baseContainer,
                      accentBar: neutralAccent,
                  };
    }
}

function flashTone(color?: string | null): string {
    switch ((color ?? '').toLowerCase()) {
        case 'success':
            return 'border-tones-success/40 bg-card-inner text-card-foreground';
        case 'info':
            return 'border-tones-info/40 bg-card-inner text-card-foreground';
        case 'warning':
            return 'border-tones-warning/40 bg-card-inner text-card-foreground';
        case 'error':
        case 'destructive':
            return 'border-destructive/40 bg-card-inner text-card-foreground';
        default:
            return 'border-border bg-card-inner text-card-foreground';
    }
}

/* =========================================================================
 * MessageRenderer
 * ========================================================================= */

export interface MessageRendererProps {
    data: MessagePayload;
    className?: string;
    onDismiss?: () => void;
    onActionClick?: (action: MessageActionCore, event: React.MouseEvent) => void;
    resolveIcon?: (icon: string) => React.ReactNode;
    containerClassName?: string;
    maxChars?: number;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({
    data,
    className,
    onDismiss,
    onActionClick,
    resolveIcon,
    containerClassName,
    maxChars = 220,
}) => {
    const header = data.message;
    const lines = data.messages ?? [];
    const actions = data.actions ?? [];

    const { container, accentBar } = toneFor(header?.color, header?.variant);

    const hasBody = lines.length > 0;
    const hasActions = actions.length > 0;

    return (
        <div className={cn('pointer-events-auto', className)}>
            <div className={cn(container, 'group/message-toast', containerClassName)}>
                <span className={accentBar} aria-hidden />

                <div className={cn('relative flex gap-3', hasBody ? 'items-start' : 'items-center')}>
                    <div className="min-w-0 flex-1">
                        {header?.text && (
                            <div className={cn('flex gap-2', hasBody ? 'items-start' : 'items-center')}>
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={cn(
                                            'text-foreground',
                                            hasBody ? 'text-sm font-semibold' : 'text-md font-normal'
                                        )}
                                        dangerouslySetInnerHTML={{ __html: header.text }}
                                    />
                                </div>
                            </div>
                        )}

                        {hasBody && (
                            <MessageLines
                                lines={lines}
                                readMore
                                maxChars={maxChars}
                                onActionInteract={onDismiss}
                                onActionClick={onActionClick}
                                resolveIcon={resolveIcon}
                                className={cn(header?.text && 'mt-1.5')}
                            />
                        )}

                        {hasActions && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {actions.map((action, idx) => (
                                    <MessageAction
                                        key={idx}
                                        data={action}
                                        onInteract={onDismiss}
                                        onActionClick={onActionClick}
                                        resolveIcon={resolveIcon}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {onDismiss && (
                        <button
                            type="button"
                            onClick={onDismiss}
                            className={cn(
                                'ml-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-muted-foreground/70',
                                'hover:bg-black/5 hover:text-foreground',
                                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                hasBody ? 'mt-0.5' : 'mt-0'
                            )}
                            aria-label="Dismiss notification"
                        >
                            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
                                <path
                                    d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* =========================================================================
 * FlashBannerRenderer
 * ========================================================================= */

export interface FlashBannerRendererProps {
    data: FlashPayload;
    className?: string;
    onDismiss?: () => void;
    onActionClick?: (action: MessageActionCore, event: React.MouseEvent) => void;
    resolveIcon?: (icon: string) => React.ReactNode;
}

export const FlashBannerRenderer: React.FC<FlashBannerRendererProps> = ({
    data,
    className,
    onDismiss,
    onActionClick,
    resolveIcon,
}) => {
    const { title, messages, actions, close, icon } = data;
    const hasMessages = messages && messages.length > 0;
    const hasPrimary = !!actions?.action1;
    const hasSecondary = !!actions?.action2;

    const toneClass = flashTone(title?.color);
    const direction = actions?.direction ?? 'x';
    const vertical = direction === 'y';

    return (
        <div className={cn('w-full px-4 pt-3 sm:px-6', className)}>
            <div
                className={cn(
                    'relative mx-auto flex max-w-4xl items-stretch gap-4 overflow-hidden rounded-xl border shadow-md',
                    'bg-linear-to-r from-card-inner to-card',
                    toneClass
                )}
            >
                {onDismiss && close?.show !== false && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="absolute top-1/2 right-3 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        aria-label="Dismiss banner"
                    >
                        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
                            <path
                                d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                )}

                {icon && (
                    <div className="flex flex-none items-center pr-1 pl-4 sm:pl-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-md">
                            <MessageIcon
                                data={{
                                    ...icon,
                                    width: icon.width ?? 40,
                                    height: icon.height ?? 40,
                                }}
                                className="text-primary"
                                resolveIcon={resolveIcon}
                            />
                        </div>
                    </div>
                )}

                <div className="flex min-w-0 flex-1 items-center py-3 pr-10">
                    <div className="min-w-0 space-y-1">
                        {title?.text && (
                            <h2 className="truncate text-sm leading-snug font-semibold text-foreground sm:text-base">
                                {title.text}
                            </h2>
                        )}

                        {hasMessages && (
                            <MessageLines
                                lines={messages}
                                readMore
                                maxChars={300}
                                onActionInteract={onDismiss}
                                onActionClick={onActionClick}
                                resolveIcon={resolveIcon}
                                className="space-y-0.5"
                            />
                        )}
                    </div>
                </div>

                {(hasPrimary || hasSecondary) && (
                    <div className="flex flex-none items-center px-4 pr-8 sm:pr-10">
                        <div
                            className={cn(
                                'flex gap-2',
                                vertical ? 'flex-col items-stretch' : 'flex-row flex-wrap justify-end sm:justify-start'
                            )}
                        >
                            {hasPrimary && (
                                <MessageAction
                                    data={actions!.action1!}
                                    className={cn(vertical && 'w-full justify-center')}
                                    onInteract={onDismiss}
                                    onActionClick={onActionClick}
                                    resolveIcon={resolveIcon}
                                />
                            )}
                            {hasSecondary && (
                                <MessageAction
                                    data={actions!.action2!}
                                    className={cn(vertical && 'w-full justify-center')}
                                    onInteract={onDismiss}
                                    onActionClick={onActionClick}
                                    resolveIcon={resolveIcon}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* =========================================================================
 * FlashDialogRenderer
 * ========================================================================= */

export interface FlashDialogRendererProps {
    data: FlashPayload;
    className?: string;
    isPreview?: boolean;
    onDismiss?: () => void;
    onActionClick?: (action: MessageActionCore, event: React.MouseEvent) => void;
    resolveIcon?: (icon: string) => React.ReactNode;
}

export const FlashDialogRenderer: React.FC<FlashDialogRendererProps> = ({
    data,
    className,
    onDismiss,
    onActionClick,
    resolveIcon,
    isPreview,
}) => {
    const { title, messages, actions, close, icon, ui } = data;

    const hasMessages = !!messages?.length;
    const hasPrimary = !!actions?.action1;
    const hasSecondary = !!actions?.action2;

    const toneClass = flashTone(title?.color);

    const layout = ui?.contentMode ?? 'centered';
    const isCentered = layout === 'centered' || layout === 'center';

    const direction = actions?.direction ?? 'x';
    const vertical = direction === 'y';

    const content = (
        <div className={cn('relative w-full max-w-lg', 'min-w-[min(100%,18rem)]', className)}>
            <div
                className={cn(
                    'relative overflow-hidden rounded-xl border shadow-xl',
                    'bg-linear-to-b from-card-inner to-card',
                    toneClass
                )}
            >
                {close?.show !== false && onDismiss && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="absolute top-2 right-2 z-50 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        aria-label="Dismiss dialog"
                    >
                        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                            <path
                                d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                )}

                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 10% 20%, #ff7a7a 0, transparent 40%), radial-gradient(circle at 80% 0, #61dafb 0, transparent 35%), radial-gradient(circle at 0 80%, #facc15 0, transparent 40%)',
                    }}
                />

                <div className="relative flex flex-col gap-6 py-10">
                    {icon && (
                        <div className={cn('flex px-8 pt-1', isCentered ? 'justify-center' : 'justify-start')}>
                            <div className="flex items-center justify-center bg-transparent">
                                <MessageIcon
                                    data={{
                                        ...icon,
                                        width: icon.width ?? 72,
                                        height: icon.height ?? 72,
                                    }}
                                    className="text-primary"
                                    resolveIcon={resolveIcon}
                                />
                            </div>
                        </div>
                    )}

                    <div
                        className={cn(
                            'flex w-full min-w-0 flex-col gap-3 px-8 wrap-break-word',
                            isCentered ? 'text-center' : 'text-left'
                        )}
                    >
                        {title?.text && (
                            <h2 className="text-xl leading-snug font-bold text-foreground sm:text-2xl">
                                {title.text}
                            </h2>
                        )}

                        {hasMessages && (
                            <MessageLines
                                contentMode={isCentered ? 'centered' : 'normal'}
                                lines={messages}
                                readMore
                                maxChars={600}
                                onActionInteract={onDismiss}
                                onActionClick={onActionClick}
                                resolveIcon={resolveIcon}
                                className="space-y-1"
                            />
                        )}
                    </div>

                    {(hasPrimary || hasSecondary) && (
                        <div
                            className={cn(
                                'mt-2 flex gap-3 px-8',
                                vertical ? 'flex-col' : 'flex-row flex-wrap',
                                isCentered ? 'justify-center' : ''
                            )}
                        >
                            {hasPrimary && (
                                <MessageAction
                                    data={actions!.action1!}
                                    className={cn(vertical && 'w-full justify-center')}
                                    onInteract={onDismiss}
                                    onActionClick={onActionClick}
                                    resolveIcon={resolveIcon}
                                />
                            )}
                            {hasSecondary && (
                                <MessageAction
                                    data={actions!.action2!}
                                    className={cn(vertical && 'w-full justify-center')}
                                    onInteract={onDismiss}
                                    onActionClick={onActionClick}
                                    resolveIcon={resolveIcon}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (isPreview) {
        return content;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" aria-hidden="true" onClick={onDismiss} />
            {content}
        </div>
    );
};

/* =========================================================================
 * FlashRenderer
 * ========================================================================= */

export interface FlashRendererProps {
    data: FlashPayload;
    className?: string;
    isPreview?: boolean;
    onDismiss?: () => void;
    onActionClick?: (action: MessageActionCore, event: React.MouseEvent) => void;
    resolveIcon?: (icon: string) => React.ReactNode;
}

export const FlashRenderer: React.FC<FlashRendererProps> = ({
    data,
    className,
    isPreview = false,
    onDismiss,
    onActionClick,
    resolveIcon,
}) => {
    const isBanner = data.ui?.mode === 'banner';

    if (isBanner) {
        return (
            <FlashBannerRenderer
                data={data}
                className={className}
                onDismiss={onDismiss}
                onActionClick={onActionClick}
                resolveIcon={resolveIcon}
            />
        );
    }

    return (
        <FlashDialogRenderer
            data={data}
            className={className}
            isPreview={isPreview}
            onDismiss={onDismiss}
            onActionClick={onActionClick}
            resolveIcon={resolveIcon}
        />
    );
};

/* =========================================================================
 * MessageFeed
 * ========================================================================= */

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface MessageFeedProps {
    position?: ToastPosition;
    maxVisible?: number;
    group?: string;
    className?: string;
}

function positionClasses(position: ToastPosition): string {
    switch (position) {
        case 'top-left':
            return 'items-start justify-start';
        case 'top-right':
            return 'items-start justify-end';
        case 'bottom-left':
            return 'items-end justify-start';
        case 'bottom-right':
        default:
            return 'items-end justify-end';
    }
}

function columnDirection(position: ToastPosition): string {
    if (position.startsWith('bottom')) {
        return 'flex-col-reverse';
    }
    return 'flex-col';
}

interface MessageToastProps {
    entry: any;
    onDismiss: (id: string) => void;
}

const MessageToast: React.FC<MessageToastProps> = ({ entry, onDismiss }) => {
    const { payload, ui } = entry;
    const data = payload.data as MessagePayload;
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        if (!ui?.autoCloseMs || ui.persistent) return;
        if (isHovered) return;

        const timer = window.setTimeout(() => {
            onDismiss(entry.id);
        }, ui.autoCloseMs);

        return () => window.clearTimeout(timer);
    }, [entry.id, ui?.autoCloseMs, ui?.persistent, isHovered, onDismiss]);

    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <MessageRenderer data={data} onDismiss={() => onDismiss(entry.id)} />
        </div>
    );
};

export const MessageFeed: React.FC<MessageFeedProps> = ({
    position = 'top-right',
    maxVisible = 5,
    group,
    className,
}) => {
    const { entries, dismiss } = useLogger();

    const messageEntries = React.useMemo(
        () =>
            entries.filter((entry) => {
                if (entry.payload.kind !== 'message') return false;
                if (group && entry.ui?.group && entry.ui.group !== group) return false;
                return !(group && !entry.ui?.group);
            }),
        [entries, group]
    );

    const visible = React.useMemo(() => {
        if (messageEntries.length <= maxVisible) return messageEntries;
        return messageEntries.slice(messageEntries.length - maxVisible);
    }, [messageEntries, maxVisible]);

    if (visible.length === 0) {
        return null;
    }

    return (
        <div
            className={cn('pointer-events-none fixed inset-0 z-[99999999] flex', positionClasses(position), className)}
            aria-live="polite"
            aria-atomic="false"
        >
            <div className={cn('pointer-events-auto m-4 flex w-full max-w-sm gap-2', columnDirection(position))}>
                {visible.map((entry) => (
                    <MessageToast key={entry.id} entry={entry} onDismiss={dismiss} />
                ))}
            </div>
        </div>
    );
};

/* =========================================================================
 * FlashFeed
 * ========================================================================= */

export interface FlashFeedProps {
    group?: string;
    className?: string;
}

export const FlashFeed: React.FC<FlashFeedProps> = ({ group, className }) => {
    const { entries, dismiss } = useLogger();

    const flashEntries = React.useMemo(
        () =>
            entries.filter((entry) => {
                if (entry.payload.kind !== 'flash') return false;
                if (group && entry.ui?.group && entry.ui.group !== group) return false;
                return !(group && !entry.ui?.group);
            }),
        [entries, group]
    );

    if (flashEntries.length === 0) {
        return null;
    }

    return (
        <div
            className={cn('pointer-events-none fixed inset-0 z-[99999999] flex flex-col', className)}
            aria-live="assertive"
            aria-atomic="true"
        >
            {/* Banner-style flashes (top stack) */}
            <div className="pointer-events-auto fixed inset-x-0 top-0 flex flex-col gap-2 p-4">
                {flashEntries.map((entry) => {
                    const flash = entry.payload.data as FlashPayload;
                    const isBanner = flash.ui?.mode === 'banner';
                    if (!isBanner) return null;

                    return <FlashBannerRenderer key={entry.id} data={flash} onDismiss={() => dismiss(entry.id)} />;
                })}
            </div>

            {/* Dialog-style flashes (centered overlays) */}
            {flashEntries.map((entry) => {
                const flash = entry.payload.data as FlashPayload;
                const isBanner = flash.ui?.mode === 'banner';
                if (isBanner) return null;

                return (
                    <FlashDialogRenderer
                        key={entry.id}
                        data={flash}
                        onDismiss={() => dismiss(entry.id)}
                    />
                );
            })}
        </div>
    );
};

export * from './logger-provider';
import { useLogger } from './logger-provider';
