import * as React from 'react';
import type {
    FlashPayload,
    MessagePayload,
} from './feed-renderer.types';

/* =========================================================================
 * Logger Types
 * ========================================================================= */

export type LoggerSource = 'page' | 'axios' | 'manual';

export type LoggerDisplayMode = 'alert' | 'dialog' | 'banner';

export type LoggerLevel = 'success' | 'info' | 'warning' | 'error' | 'primary' | 'default';

export type LoggerPayloadKind = 'message' | 'flash';

export interface LoggerUiMeta {
    mode: LoggerDisplayMode;
    group?: string;
    autoCloseMs?: number | null;
    persistent?: boolean;
    props?: Record<string, unknown>;
}

export interface LoggerEntry {
    id: string;
    createdAt: number;
    source: LoggerSource;
    level: LoggerLevel;
    payload: {
        kind: LoggerPayloadKind;
        data: MessagePayload | FlashPayload;
    };
    ui: LoggerUiMeta;
    raw?: unknown;
    consumed?: boolean;
}

export interface LoggerHelperMeta {
    source?: LoggerSource;
    ui?: Partial<LoggerUiMeta>;
    raw?: unknown;
}

export type LoggerHelperPayloadInput = LoggerHelperMeta & (
    | { kind: 'message'; payload: Omit<MessagePayload, 'id'> }
    | { kind: 'flash'; payload: Omit<FlashPayload, 'id'> }
);

export interface LoggerHelperTextInput extends LoggerHelperMeta {
    text: string;
    kind?: LoggerPayloadKind;
}

export interface LoggerContextValue {
    entries: LoggerEntry[];
    push(entry: LoggerEntry): void;
    logMessage(options: {
        payload: MessagePayload;
        level?: LoggerLevel;
        source?: LoggerSource;
        ui?: Partial<LoggerUiMeta>;
        raw?: unknown;
    }): void;
    logFlash(options: {
        payload: FlashPayload;
        level?: LoggerLevel;
        source?: LoggerSource;
        ui?: Partial<LoggerUiMeta>;
        raw?: unknown;
    }): void;
    dismiss(id: string): void;
    clear(): void;
    success(input: LoggerHelperPayloadInput): void;
    success(text: string, options?: Omit<LoggerHelperTextInput, 'text'>): void;
    info(input: LoggerHelperPayloadInput): void;
    info(text: string, options?: Omit<LoggerHelperTextInput, 'text'>): void;
    warning(input: LoggerHelperPayloadInput): void;
    warning(text: string, options?: Omit<LoggerHelperTextInput, 'text'>): void;
    error(input: LoggerHelperPayloadInput): void;
    error(text: string, options?: Omit<LoggerHelperTextInput, 'text'>): void;
    primary(input: LoggerHelperPayloadInput): void;
    primary(text: string, options?: Omit<LoggerHelperTextInput, 'text'>): void;
}

/* =========================================================================
 * Utilities / Helpers
 * ========================================================================= */

function makeId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): number {
    return Date.now();
}

function levelToColor(level: LoggerLevel): string {
    switch (level) {
        case 'success':
            return 'success';
        case 'info':
            return 'info';
        case 'warning':
            return 'warning';
        case 'error':
            return 'destructive';
        case 'primary':
            return 'primary';
        case 'default':
        default:
            return 'normal';
    }
}

function inferLevelFromColor(color?: string | null): LoggerLevel {
    if (!color) return 'default';
    switch (color) {
        case 'success':
            return 'success';
        case 'info':
            return 'info';
        case 'warning':
            return 'warning';
        case 'error':
        case 'destructive':
            return 'error';
        case 'primary':
            return 'primary';
        default:
            return 'default';
    }
}

function defaultModeForKind(kind: LoggerPayloadKind): LoggerUiMeta['mode'] {
    return kind === 'flash' ? 'banner' : 'alert';
}

function buildDefaultUi(kind: LoggerPayloadKind, overrides?: Partial<LoggerUiMeta>): LoggerUiMeta {
    const base: LoggerUiMeta = {
        mode: defaultModeForKind(kind),
        autoCloseMs: kind === 'message' ? 5000 : null,
        persistent: kind === 'flash',
        group: undefined,
        props: {},
    };

    return {
        ...base,
        ...overrides,
        props: {
            ...base.props,
            ...(overrides?.props ?? {}),
        },
    };
}

function levelToTitle(level: LoggerLevel): string {
    switch (level) {
        case 'success':
            return 'Success';
        case 'info':
            return 'Heads up';
        case 'warning':
            return 'Warning';
        case 'error':
            return 'Something went wrong';
        case 'primary':
            return 'Notice';
        case 'default':
        default:
            return 'Notice';
    }
}

function buildMessagePayloadFromText(text: string, level: LoggerLevel): MessagePayload {
    const color = levelToColor(level);
    const title = levelToTitle(level);

    return {
        id: makeId(),
        message: {
            text: title,
            color,
            variant: 'outlined',
        },
        messages: [
            {
                text,
                weight: 'light',
                color,
                type: 'body',
                newline: true,
                props: {},
                action: undefined,
            },
        ],
    };
}

function buildFlashPayloadFromText(text: string, level: LoggerLevel): FlashPayload {
    const color = levelToColor(level);
    const title = levelToTitle(level);

    return {
        id: makeId(),
        title: {
            text: title,
            color,
            weight: 'dark',
        },
        ui: {
            mode: 'dialog',
            contentMode: 'auto',
            props: {}
        },
        messages: [
            {
                text,
                weight: 'light',
                color,
                type: 'body',
                newline: true,
                props: {},
                action: undefined,
            },
        ],
        actions: {
            direction: 'x',
            action1: undefined,
            action2: undefined,
        },
        close: {
            show: true,
            action: undefined,
        },
        icon: null,
    };
}

function createMessageEntry(
    payload: MessagePayload,
    opts: {
        level?: LoggerLevel;
        source?: LoggerSource;
        ui?: Partial<LoggerUiMeta>;
        raw?: unknown;
    }
): LoggerEntry {
    const inferredColor = payload.message?.color;
    const level = opts.level ?? inferLevelFromColor(inferredColor);
    const kind: LoggerPayloadKind = 'message';
    const ui = buildDefaultUi(kind, opts.ui);

    return {
        id: makeId(),
        createdAt: now(),
        source: opts.source ?? 'manual',
        level,
        payload: {
            kind,
            data: payload,
        },
        ui,
        raw: opts.raw,
        consumed: false,
    };
}

function createFlashEntry(
    payload: FlashPayload,
    opts: {
        level?: LoggerLevel;
        source?: LoggerSource;
        ui?: Partial<LoggerUiMeta>;
        raw?: unknown;
    }
): LoggerEntry {
    const inferredColor = payload.title?.color;
    const level = opts.level ?? inferLevelFromColor(inferredColor);
    const kind: LoggerPayloadKind = 'flash';
    const ui = buildDefaultUi(kind, opts.ui);

    return {
        id: makeId(),
        createdAt: now(),
        source: opts.source ?? 'manual',
        level,
        payload: {
            kind,
            data: payload,
        },
        ui,
        raw: opts.raw,
        consumed: false,
    };
}

/* =========================================================================
 * Context & Provider Implementation
 * ========================================================================= */

const LoggerContext = React.createContext<LoggerContextValue | undefined>(undefined);

export interface LoggerProviderProps {
    children: React.ReactNode;
}

export function LoggerProvider({ children }: LoggerProviderProps) {
    const [entries, setEntries] = React.useState<LoggerEntry[]>([]);

    const push = React.useCallback((entry: LoggerEntry) => {
        setEntries((prev) => [...prev, entry]);
    }, []);

    const logMessage: LoggerContextValue['logMessage'] = React.useCallback(
        ({ payload, level, source, ui, raw }) => {
            const entry = createMessageEntry(payload, { level, source, ui, raw });
            push(entry);
        },
        [push]
    );

    const logFlash: LoggerContextValue['logFlash'] = React.useCallback(
        ({ payload, level, source, ui, raw }) => {
            const entry = createFlashEntry(payload, { level, source, ui, raw });
            push(entry);
        },
        [push]
    );

    const dismiss: LoggerContextValue['dismiss'] = React.useCallback((id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
    }, []);

    const clear: LoggerContextValue['clear'] = React.useCallback(() => {
        setEntries([]);
    }, []);

    function makeLevelHelper(level: LoggerLevel) {
        return function helper(
            arg1: LoggerHelperPayloadInput | string,
            arg2?: Omit<LoggerHelperTextInput, 'text'>
        ): void {
            if (typeof arg1 === 'string') {
                const text = arg1;
                const { source = 'manual', ui, raw, kind = 'message' } = (arg2 ?? {}) as LoggerHelperTextInput;

                if (kind === 'flash') {
                    const payload = buildFlashPayloadFromText(text, level);
                    logFlash({ payload, level, source, ui, raw });
                } else {
                    const payload = buildMessagePayloadFromText(text, level);
                    logMessage({ payload, level, source, ui, raw });
                }
                return;
            }

            const { payload, kind = 'message', source = 'manual', ui, raw } = arg1;

            if (kind === 'flash') {
                logFlash({ payload: payload as FlashPayload, level, source, ui, raw });
            } else {
                logMessage({ payload: payload as MessagePayload, level, source, ui, raw });
            }
        };
    }

    const success = React.useCallback(makeLevelHelper('success'), [logMessage, logFlash]);
    const info = React.useCallback(makeLevelHelper('info'), [logMessage, logFlash]);
    const warning = React.useCallback(makeLevelHelper('warning'), [logMessage, logFlash]);
    const error = React.useCallback(makeLevelHelper('error'), [logMessage, logFlash]);
    const primary = React.useCallback(makeLevelHelper('primary'), [logMessage, logFlash]);

    const value = React.useMemo<LoggerContextValue>(
        () => ({
            entries,
            push,
            logMessage,
            logFlash,
            dismiss,
            clear,
            success,
            info,
            warning,
            error,
            primary,
        }),
        [entries, push, logMessage, logFlash, dismiss, clear, success, info, warning, error, primary]
    );

    return <LoggerContext.Provider value={value}>{children}</LoggerContext.Provider>;
}

export function useLogger(): LoggerContextValue {
    const ctx = React.useContext(LoggerContext);
    if (!ctx) {
        throw new Error('useLogger must be used within a LoggerProvider');
    }
    return ctx;
}
