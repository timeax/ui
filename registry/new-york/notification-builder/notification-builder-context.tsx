import * as React from 'react';
import type {
    FlashPayload,
    MessageActionCore,
    MessageActionPayload,
    MessageIconPayload,
    MessageLinePayload,
    MessagePayload,
} from '../feed-renderer/feed-renderer.types';
import type {
    DraftActionButton,
    DraftActionCore,
    DraftActionInline,
    DraftActionPayload,
    DraftEmailPayload,
    DraftFlashPayload,
    DraftIconPayload,
    DraftLinePayload,
    DraftMessagePayload,
    DraftPushPayload,
    DraftSmsPayload,
    EditorContextValue,
    EditorIssue,
    EditorMode,
    EditorSelection,
    NotificationEditorRef,
    NotificationTemplateEditorProps,
} from './notification-builder.types';

/* =========================================================================
 * Utilities / Helpers
 * ========================================================================= */

export const MAX_ICON_SIZE = 64;
export const CSS_FIELD_KEYS = [
    'color',
    'backgroundColor',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textAlign',
    'padding',
    'margin',
    'borderRadius',
    'border',
    'boxShadow',
    'width',
    'height',
    'maxWidth',
    'maxHeight',
    'display',
    'alignItems',
    'justifyContent',
    'gap',
    'opacity',
];

export const CSS_FIELDS = [
    { key: 'color', label: 'Text color', variant: 'color' },
    { key: 'backgroundColor', label: 'Background', variant: 'color' },
    { key: 'fontSize', label: 'Font size', placeholder: '14px' },
    { key: 'fontWeight', label: 'Font weight', placeholder: '600' },
    { key: 'lineHeight', label: 'Line height', placeholder: '1.4' },
    { key: 'letterSpacing', label: 'Letter spacing', placeholder: '0.02em' },
    { key: 'textAlign', label: 'Text align', placeholder: 'left' },
    { key: 'padding', label: 'Padding', placeholder: '8px 12px' },
    { key: 'margin', label: 'Margin', placeholder: '0' },
    { key: 'borderRadius', label: 'Border radius', placeholder: '8px' },
    { key: 'border', label: 'Border', placeholder: '1px solid #e5e7eb' },
    { key: 'boxShadow', label: 'Box shadow' },
    { key: 'width', label: 'Width', placeholder: 'auto' },
    { key: 'height', label: 'Height', placeholder: 'auto' },
    { key: 'maxWidth', label: 'Max width' },
    { key: 'maxHeight', label: 'Max height' },
    { key: 'display', label: 'Display', placeholder: 'inline-flex' },
    { key: 'alignItems', label: 'Align items' },
    { key: 'justifyContent', label: 'Justify content' },
    { key: 'gap', label: 'Gap', placeholder: '8px' },
    { key: 'opacity', label: 'Opacity', placeholder: '0.9' },
];

export const MESSAGE_RESERVED_KEYS = new Set(['id', 'message', 'messages', 'actions', 'props']);

export function uid(prefix: string) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function clampSize(value?: number | null) {
    if (value == null) return value;
    if (!Number.isFinite(value)) return null;
    return Math.min(value, MAX_ICON_SIZE);
}

export function splitCssProps(raw?: Record<string, unknown>) {
    const base: Record<string, string> = {};
    const extra: Record<string, string> = {};
    if (!raw) return { base, extra };

    for (const [key, value] of Object.entries(raw)) {
        const strValue = value == null ? '' : String(value);
        if (CSS_FIELD_KEYS.includes(key)) {
            base[key] = strValue;
        } else {
            extra[key] = strValue;
        }
    }

    return { base, extra };
}

export function buildCssProps(base: Record<string, string>, extra: Record<string, string>) {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(base)) {
        const trimmed = typeof value === 'string' ? value.trim() : String(value);
        if (trimmed !== '') out[key] = trimmed;
    }
    for (const [key, value] of Object.entries(extra)) {
        const trimmed = typeof value === 'string' ? value.trim() : String(value);
        if (trimmed !== '') out[key] = trimmed;
    }
    return out;
}

export function getMessageExtras(draft: DraftMessagePayload): Record<string, unknown> {
    const extra: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(draft as Record<string, unknown>)) {
        if (!MESSAGE_RESERVED_KEYS.has(key)) {
            extra[key] = value;
        }
    }
    return extra;
}

export function normalizeIconPayload(icon: MessageIconPayload): MessageIconPayload {
    return {
        ...icon,
        width: typeof icon.width === 'number' ? clampSize(icon.width) : icon.width ?? undefined,
        height: typeof icon.height === 'number' ? clampSize(icon.height) : icon.height ?? undefined,
        props: icon.props ?? {},
    };
}

export function ensureIcon(icon?: MessageIconPayload | DraftIconPayload | null): DraftIconPayload | null {
    if (!icon) return null;
    const base = normalizeIconPayload(icon);
    const editorId = (icon as DraftIconPayload).__editorId ?? uid('icon');
    return { ...(base as MessageIconPayload), __editorId: editorId };
}

export function ensureAction(action?: MessageActionPayload | DraftActionPayload | null): DraftActionPayload | null {
    if (!action) return null;
    const hasEditorId = (action as DraftActionPayload).__editorId;
    const editorId = hasEditorId ?? uid('action');

    if ('text' in action) {
        const raw = action as DraftActionButton;
        const core = raw.action ?? (raw as any).action;
        const icon = ensureIcon(raw.icon ?? core?.icon ?? null);
        const nextCore: DraftActionCore = {
            ...(core as MessageActionCore),
            icon: icon ?? null,
        };
        return {
            ...raw,
            __editorId: editorId,
            action: nextCore,
            icon: icon ?? undefined,
            text: raw.text ?? 'Action',
            variant: raw.variant ?? null,
            color: raw.color ?? null,
            weight: raw.weight ?? null,
            fullWidth: raw.fullWidth ?? null,
            canDismiss: raw.canDismiss ?? null,
        };
    }

    const raw = action as DraftActionInline;
    const icon = ensureIcon(raw.icon ?? null);
    return {
        ...(raw as MessageActionCore),
        __editorId: editorId,
        icon: icon ?? null,
    };
}

export function ensureLine(line: MessageLinePayload | DraftLinePayload): DraftLinePayload {
    const editorId = (line as DraftLinePayload).__editorId ?? uid('line');
    return {
        ...(line as MessageLinePayload),
        __editorId: editorId,
        action: ensureAction((line as DraftLinePayload).action ?? null) ?? undefined,
        icons: ((line as DraftLinePayload).icons ?? []).map((icon) => ensureIcon(icon)!).filter(Boolean),
    };
}

export function hydrateMessageDraft(payload: MessagePayload): DraftMessagePayload {
    return {
        ...payload,
        messages: (payload.messages ?? []).map((line) => ensureLine(line)),
        actions: (payload.actions ?? []).map((action) => ensureAction(action)!).filter(Boolean),
    };
}

export function hydrateFlashDraft(payload: FlashPayload): DraftFlashPayload {
    return {
        ...payload,
        messages: (payload.messages ?? []).map((line) => ensureLine(line)),
        actions: {
            direction: payload.actions?.direction ?? 'x',
            action1: ensureAction(payload.actions?.action1 ?? null) ?? undefined,
            action2: ensureAction(payload.actions?.action2 ?? null) ?? undefined,
        },
        close: {
            show: payload.close?.show ?? false,
            action: ensureAction(payload.close?.action ?? null) ?? undefined,
        },
        icon: ensureIcon(payload.icon ?? null),
    };
}

export function stripIcon(icon: DraftIconPayload | null | undefined): MessageIconPayload | null {
    if (!icon) return null;
    const { __editorId, ...rest } = icon;
    return rest;
}

export function stripAction(action?: DraftActionPayload | null): MessageActionPayload | null {
    if (!action) return null;
    if ('text' in action) {
        const { __editorId, icon, action: core, ...rest } = action as DraftActionButton;
        const coreIcon = stripIcon(core.icon ?? null);
        const nextCore: MessageActionCore = {
            ...core,
            icon: coreIcon ?? undefined,
        };
        return {
            ...(rest as MessageActionPayload),
            text: rest.text ?? 'Action',
            variant: rest.variant ?? null,
            color: rest.color ?? null,
            weight: rest.weight ?? null,
            action: nextCore,
            icon: coreIcon ?? undefined,
            fullWidth: rest.fullWidth ?? undefined,
            canDismiss: rest.canDismiss ?? undefined,
        } as MessageActionPayload;
    }
    const { __editorId, icon, ...rest } = action as DraftActionInline;
    return {
        ...(rest as MessageActionCore),
        icon: stripIcon(icon ?? null) ?? undefined,
    };
}

export function stripLine(line: DraftLinePayload): MessageLinePayload {
    const { __editorId, action, icons, ...rest } = line;
    return {
        ...(rest as MessageLinePayload),
        action: stripAction(action ?? null) ?? undefined,
        icons: (icons ?? []).map((icon) => stripIcon(icon as any)!) ?? undefined,
    };
}

export function toMessagePayload(draft: DraftMessagePayload): MessagePayload {
    return {
        ...draft,
        messages: (draft.messages ?? []).map((line) => stripLine(line)),
        actions: (draft.actions ?? []).map((action) => stripAction(action)!) ?? undefined,
    } as any;
}

export function toFlashPayload(draft: DraftFlashPayload): FlashPayload {
    return {
        ...draft,
        messages: (draft.messages ?? []).map((line) => stripLine(line)),
        actions: {
            direction: draft.actions?.direction ?? 'x',
            action1: stripAction(draft.actions?.action1 ?? null) ?? undefined,
            action2: stripAction(draft.actions?.action2 ?? null) ?? undefined,
        },
        close: {
            show: draft.close?.show ?? false,
            action: stripAction(draft.close?.action ?? null) ?? undefined,
        },
        icon: stripIcon(draft.icon ?? null),
    };
}

export function defaultMessageDraft(): DraftMessagePayload {
    return {
        id: uid('message'),
        message: { text: '' },
        messages: [],
        actions: [],
    };
}

export function defaultFlashDraft(): DraftFlashPayload {
    return {
        id: uid('flash'),
        title: { text: '', color: '', weight: '' },
        variant: 'info',
        messages: [],
        actions: { direction: 'x' },
        close: { show: false },
        icon: null,
    };
}

export function defaultEmailDraft(): DraftEmailPayload {
    return { subject: '', message: '' };
}
export function defaultSmsDraft(): DraftSmsPayload {
    return { subject: '', message: '' };
}
export function defaultPushDraft(): DraftPushPayload {
    return { title: '', message: '', icon: null, click_action: null };
}

export function hydrateEmailDraft(input: any): DraftEmailPayload {
    return {
        subject: typeof input?.subject === 'string' ? input.subject : '',
        message: typeof input?.message === 'string' ? input.message : '',
    };
}

export function hydrateSmsDraft(input: any): DraftSmsPayload {
    return {
        subject: typeof input?.subject === 'string' ? input.subject : '',
        message: typeof input?.message === 'string' ? input.message : '',
    };
}

export function hydratePushDraft(input: any): DraftPushPayload {
    return {
        title: typeof input?.title === 'string' ? input.title : '',
        message: typeof input?.message === 'string' ? input.message : '',
        icon: typeof input?.icon === 'string' ? input.icon : null,
        click_action: typeof input?.click_action === 'string' ? input.click_action : null,
    };
}

export function findLineById(draft: DraftMessagePayload | DraftFlashPayload, editorId: string): DraftLinePayload | null {
    const lines = draft.messages ?? [];
    return lines.find((line) => line.__editorId === editorId) ?? null;
}

export function findActionById(draft: DraftMessagePayload | DraftFlashPayload, editorId: string): DraftActionPayload | null {
    const inLines = draft.messages ?? [];
    for (const line of inLines) {
        if (line.action && (line.action as any).__editorId === editorId) return line.action;
    }

    if ('actions' in draft) {
        if (Array.isArray(draft.actions)) {
            return draft.actions.find((action) => (action as any).__editorId === editorId) ?? null;
        }
    }

    if ('actions' in draft && !Array.isArray(draft.actions)) {
        if (draft.actions?.action1?.__editorId === editorId) return draft.actions.action1;
        if (draft.actions?.action2?.__editorId === editorId) return draft.actions.action2;
    }

    if ('close' in draft && (draft.close as any)?.action?.__editorId === editorId) {
        return (draft.close as any).action;
    }

    return null;
}

export function findIconById(draft: DraftMessagePayload | DraftFlashPayload, editorId: string): DraftIconPayload | null {
    for (const line of draft.messages ?? []) {
        const match = (line.icons ?? []).find((icon) => (icon as any).__editorId === editorId);
        if (match) return match as any;

        const actionIcon = line.action ? getActionIcon(line.action) : null;
        if (actionIcon?.__editorId === editorId) return actionIcon;
    }

    if ('actions' in draft) {
        if (Array.isArray(draft.actions)) {
            for (const action of draft.actions) {
                const actionIcon = getActionIcon(action);
                if (actionIcon?.__editorId === editorId) return actionIcon;
            }
        } else {
            const a1 = draft.actions?.action1 ? getActionIcon(draft.actions.action1) : null;
            if (a1?.__editorId === editorId) return a1;
            const a2 = draft.actions?.action2 ? getActionIcon(draft.actions.action2) : null;
            if (a2?.__editorId === editorId) return a2;
        }
    }

    if ('close' in draft) {
        const closeIcon = (draft.close as any)?.action ? getActionIcon((draft.close as any).action) : null;
        if (closeIcon?.__editorId === editorId) return closeIcon;
    }

    if ('icon' in draft && (draft.icon as any)?.__editorId === editorId) {
        return draft.icon as any;
    }

    return null;
}

export function getActionIcon(action: DraftActionPayload): DraftIconPayload | null {
    if ('text' in action) {
        return action.icon ?? action.action?.icon ?? null;
    }
    return action.icon ?? null;
}

export function setActionIcon(action: DraftActionPayload, icon: DraftIconPayload | null) {
    if ('text' in action) {
        action.icon = icon ?? undefined;
        action.action.icon = icon ?? null;
    } else {
        action.icon = icon ?? null;
    }
}

export function normalizeActionCore(core: MessageActionCore) {
    if (core.handler === 'blank' && core.route) {
        return {
            ...core,
            method: 'GET',
        };
    }
    return core;
}

/* =========================================================================
 * Context & Provider Implementation
 * ========================================================================= */

const EditorContext = React.createContext<EditorContextValue | null>(null);

export function useNotificationEditor() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) {
        throw new Error('useNotificationEditor must be used inside NotificationTemplateEditor');
    }
    return ctx;
}

export const NotificationTemplateEditor = React.forwardRef<NotificationEditorRef, NotificationTemplateEditorProps>(
    ({ mode: initialMode = 'log', draft: initialDraft, children, onChange, onModeChange }, ref) => {
        const [mode, setModeState] = React.useState<EditorMode>(initialMode);
        const [selection, setSelection] = React.useState<EditorSelection | null>(null);
        const [testData, setTestData] = React.useState<Record<string, unknown> | null>(null);

        const draftRef = React.useRef<any>(
            (() => {
                if (initialDraft) {
                    if (initialMode === 'flash') return hydrateFlashDraft(initialDraft as FlashPayload);
                    if (initialMode === 'log') return hydrateMessageDraft(initialDraft as MessagePayload);
                    if (initialMode === 'email') return hydrateEmailDraft(initialDraft);
                    if (initialMode === 'sms') return hydrateSmsDraft(initialDraft);
                    if (initialMode === 'push') return hydratePushDraft(initialDraft);
                }

                if (initialMode === 'flash') return defaultFlashDraft();
                if (initialMode === 'email') return defaultEmailDraft();
                if (initialMode === 'sms') return defaultSmsDraft();
                if (initialMode === 'push') return defaultPushDraft();
                return defaultMessageDraft();
            })()
        );

        const [version, forceUpdate] = React.useState(0);

        React.useEffect(() => {
            setModeState(initialMode);
            setSelection(null);

            if (!initialDraft) return;

            draftRef.current =
                initialMode === 'flash'
                    ? hydrateFlashDraft(initialDraft as FlashPayload)
                    : initialMode === 'log'
                      ? hydrateMessageDraft(initialDraft as MessagePayload)
                      : initialMode === 'email'
                        ? hydrateEmailDraft(initialDraft)
                        : initialMode === 'sms'
                          ? hydrateSmsDraft(initialDraft)
                          : hydratePushDraft(initialDraft);

            forceUpdate((x) => x + 1);
        }, [initialDraft, initialMode]);

        function commit(next: any) {
            draftRef.current = next;
            forceUpdate((x) => x + 1);
            if (onChange) {
                onChange(next);
            }
        }

        const context = React.useMemo<EditorContextValue>(() => {
            const api: EditorContextValue = {
                mode,
                selection,
                testData,
                get draft() {
                    return draftRef.current;
                },
                getDraft() {
                    return draftRef.current;
                },
                setDraft(draft) {
                    const next =
                        mode === 'flash'
                            ? hydrateFlashDraft(draft as FlashPayload)
                            : mode === 'log'
                              ? hydrateMessageDraft(draft as MessagePayload)
                              : mode === 'email'
                                ? hydrateEmailDraft(draft)
                                : mode === 'sms'
                                  ? hydrateSmsDraft(draft)
                                  : hydratePushDraft(draft);

                    commit(next as any);
                },
                setMode(nextMode) {
                    if (nextMode === mode) return;

                    setModeState(nextMode);
                    setSelection(null);

                    if (onModeChange) {
                        onModeChange(nextMode);
                    }

                    const next =
                        nextMode === 'flash'
                            ? defaultFlashDraft()
                            : nextMode === 'email'
                              ? defaultEmailDraft()
                              : nextMode === 'sms'
                                ? defaultSmsDraft()
                                : nextMode === 'push'
                                  ? defaultPushDraft()
                                  : defaultMessageDraft();

                    commit(next as any);
                },
                select(target) {
                    setSelection(target);
                },
                clearSelection() {
                    setSelection(null);
                },

                addLine(payload) {
                    if (mode !== 'log' && mode !== 'flash') return '';
                    const next = { ...draftRef.current };
                    const line = ensureLine({
                        text: '',
                        ...payload,
                    });
                    next.messages = [...(next.messages ?? []), line];
                    commit(next);
                    return line.__editorId;
                },
                updateLine(editorId, patch) {
                    if (mode !== 'log' && mode !== 'flash') return;
                    const next = { ...draftRef.current };
                    next.messages = (next.messages ?? []).map((line: any) => {
                        if (line.__editorId !== editorId) return line;
                        return { ...line, ...patch };
                    });
                    commit(next);
                },
                removeLine(editorId) {
                    if (mode !== 'log' && mode !== 'flash') return;
                    const next = { ...draftRef.current };
                    next.messages = (next.messages ?? []).filter((line: any) => line.__editorId !== editorId);
                    if (selection?.kind === 'line' && selection.editorId === editorId) {
                        setSelection(null);
                    }
                    commit(next);
                },

                addAction(payload, opts) {
                    if (mode !== 'log' && mode !== 'flash') return '';
                    const next = { ...draftRef.current };

                    const action = ensureAction({
                        method: null,
                        handler: 'inertia',
                        data: null,
                        route: null,
                        type: 'route',
                        props: {},
                        ...payload,
                    } as MessageActionPayload);

                    if (!action) return '';

                    const parent = opts?.parent;

                    if (parent?.kind === 'line' && parent.id) {
                        const line = findLineById(next, parent.id);
                        if (line) {
                            line.action = action;
                        }
                    } else if (parent?.kind === 'close') {
                        if ('close' in next) {
                            next.close = {
                                ...next.close,
                                action,
                            };
                        }
                    } else if (mode === 'flash') {
                        if ('actions' in next && !Array.isArray(next.actions)) {
                            if (parent?.slot === 'action2') {
                                next.actions.action2 = action;
                            } else if (parent?.slot === 'action1') {
                                next.actions.action1 = action;
                            } else if (!next.actions?.action1) {
                                next.actions.action1 = action;
                            } else if (!next.actions.action2) {
                                next.actions.action2 = action;
                            } else {
                                next.actions.action2 = action;
                            }
                        }
                    } else {
                        next.actions = [...(next.actions ?? []), action];
                    }

                    commit(next);
                    return (action as any).__editorId;
                },

                replaceAction(editorId, payload) {
                    if (mode !== 'log' && mode !== 'flash') return;
                    const next = { ...draftRef.current };
                    const updated = ensureAction(payload);
                    if (!updated) return;
                    (updated as any).__editorId = editorId;

                    for (const line of next.messages ?? []) {
                        if (line.action?.__editorId === editorId) {
                            line.action = updated;
                            commit(next);
                            return;
                        }
                    }

                    if (Array.isArray(next.actions)) {
                        next.actions = (next.actions ?? []).map((action: any) =>
                            action.__editorId === editorId ? updated : action
                        );
                        commit(next);
                        return;
                    }

                    if ('actions' in next && !Array.isArray(next.actions)) {
                        if (next.actions?.action1?.__editorId === editorId) next.actions.action1 = updated;
                        if (next.actions?.action2?.__editorId === editorId) next.actions.action2 = updated;
                        commit(next);
                        return;
                    }

                    if ('close' in next && next.close?.action?.__editorId === editorId) {
                        next.close.action = updated;
                        commit(next);
                        return;
                    }
                },

                updateAction(editorId, patch) {
                    if (mode !== 'log' && mode !== 'flash') return;
                    const next = { ...draftRef.current };

                    const applyPatch = (action: DraftActionPayload) => {
                        if ('text' in action) {
                            const core = normalizeActionCore({ ...action.action, ...(patch as any).action });
                            return { ...action, ...(patch as any), action: core };
                        }
                        return { ...action, ...(patch as any) };
                    };

                    for (const line of next.messages ?? []) {
                        if (line.action?.__editorId === editorId) {
                            line.action = applyPatch(line.action);
                            commit(next);
                            return;
                        }
                    }

                    if (Array.isArray(next.actions)) {
                        next.actions = (next.actions ?? []).map((action: any) =>
                            action.__editorId === editorId ? applyPatch(action) : action
                        );
                        commit(next);
                        return;
                    }

                    if ('actions' in next && !Array.isArray(next.actions)) {
                        if (next.actions?.action1?.__editorId === editorId) {
                            next.actions.action1 = applyPatch(next.actions.action1);
                        }
                        if (next.actions?.action2?.__editorId === editorId) {
                            next.actions.action2 = applyPatch(next.actions.action2);
                        }
                        commit(next);
                        return;
                    }

                    if ('close' in next && next.close?.action?.__editorId === editorId) {
                        next.close.action = applyPatch(next.close.action);
                        commit(next);
                        return;
                    }
                },

                removeAction(editorId) {
                    if (mode !== 'log' && mode !== 'flash') return;
                    const next = { ...draftRef.current };

                    for (const line of next.messages ?? []) {
                        if (line.action?.__editorId === editorId) {
                            line.action = undefined;
                            commit(next);
                            return;
                        }
                    }

                    if (Array.isArray(next.actions)) {
                        next.actions = (next.actions ?? []).filter((action: any) => action.__editorId !== editorId);
                        commit(next);
                        return;
                    }

                    if ('actions' in next && !Array.isArray(next.actions)) {
                        if (next.actions?.action1?.__editorId === editorId) next.actions.action1 = undefined;
                        if (next.actions?.action2?.__editorId === editorId) next.actions.action2 = undefined;
                        commit(next);
                        return;
                    }

                    if ('close' in next && next.close?.action?.__editorId === editorId) {
                        next.close.action = undefined;
                        commit(next);
                        return;
                    }
                },

                moveAction(editorId, direction) {
                    if (mode !== 'log') return;
                    const next = { ...draftRef.current };
                    if (!Array.isArray(next.actions)) return;

                    const list = [...(next.actions ?? [])];
                    const index = list.findIndex((action: any) => action.__editorId === editorId);
                    if (index < 0) return;

                    const target = direction === 'up' ? index - 1 : index + 1;
                    if (target < 0 || target >= list.length) return;

                    [list[index], list[target]] = [list[target], list[index]];
                    next.actions = list;
                    commit(next);
                },

                addIcon(payload, opts) {
                    if (mode !== 'log' && mode !== 'flash') return '';
                    const next = { ...draftRef.current };

                    const icon = ensureIcon({
                        icon: '',
                        type: 'icon',
                        ...payload,
                    });
                    if (!icon) return '';

                    const parent = opts?.parent;

                    if (parent?.kind === 'line' && parent.id) {
                        const line = findLineById(next, parent.id);
                        if (line) {
                            line.icons = [...(line.icons ?? []), icon];
                        }
                    } else if (parent?.kind === 'action' && parent.id) {
                        const action = findActionById(next, parent.id);
                        if (action) {
                            setActionIcon(action, icon);
                        }
                    } else if (parent?.kind === 'flash') {
                        if ('icon' in next) next.icon = icon;
                    }

                    commit(next);
                    return (icon as any).__editorId;
                },

                updateIcon(editorId, patch) {
                    if (mode !== 'log' && mode !== 'flash') return;
                    const next = { ...draftRef.current };

                    const current = findIconById(next, editorId);
                    if (!current) return;

                    const updated = ensureIcon({ ...current, ...(patch as MessageIconPayload) });
                    if (!updated) return;

                    for (const line of next.messages ?? []) {
                        line.icons = (line.icons ?? []).map((icon: any) =>
                            icon.__editorId === editorId ? { ...icon, ...updated } : icon
                        ) as any;

                        if (line.action) {
                            const actionIcon = getActionIcon(line.action);
                            if (actionIcon?.__editorId === editorId) {
                                setActionIcon(line.action, { ...actionIcon, ...updated });
                            }
                        }
                    }

                    if (Array.isArray(next.actions)) {
                        for (const action of next.actions ?? []) {
                            const actionIcon = getActionIcon(action);
                            if (actionIcon?.__editorId === editorId) {
                                setActionIcon(action, { ...actionIcon, ...updated });
                            }
                        }
                    } else if ('actions' in next && !Array.isArray(next.actions)) {
                        const a1 = next.actions?.action1;
                        const a2 = next.actions?.action2;

                        if (a1) {
                            const icon = getActionIcon(a1);
                            if (icon?.__editorId === editorId) setActionIcon(a1, { ...icon, ...updated });
                        }
                        if (a2) {
                            const icon = getActionIcon(a2);
                            if (icon?.__editorId === editorId) setActionIcon(a2, { ...icon, ...updated });
                        }
                    }

                    if ('close' in next && next.close?.action) {
                        const closeIcon = getActionIcon(next.close.action);
                        if (closeIcon?.__editorId === editorId) {
                            setActionIcon(next.close.action, { ...closeIcon, ...updated });
                        }
                    }

                    if ('icon' in next && next.icon?.__editorId === editorId) {
                        next.icon = { ...next.icon, ...updated };
                    }

                    commit(next);
                },

                removeIcon(editorId) {
                    if (mode !== 'log' && mode !== 'flash') return;
                    const next = { ...draftRef.current };

                    for (const line of next.messages ?? []) {
                        line.icons = (line.icons ?? []).filter((icon: any) => icon.__editorId !== editorId) as any;

                        if (line.action) {
                            const actionIcon = getActionIcon(line.action);
                            if (actionIcon?.__editorId === editorId) {
                                setActionIcon(line.action, null);
                            }
                        }
                    }

                    if (Array.isArray(next.actions)) {
                        for (const action of next.actions ?? []) {
                            const actionIcon = getActionIcon(action);
                            if (actionIcon?.__editorId === editorId) {
                                setActionIcon(action, null);
                            }
                        }
                    } else if ('actions' in next && !Array.isArray(next.actions)) {
                        const a1 = next.actions?.action1;
                        const a2 = next.actions?.action2;

                        if (a1) {
                            const icon = getActionIcon(a1);
                            if (icon?.__editorId === editorId) setActionIcon(a1, null);
                        }
                        if (a2) {
                            const icon = getActionIcon(a2);
                            if (icon?.__editorId === editorId) setActionIcon(a2, null);
                        }
                    }

                    if ('close' in next && next.close?.action) {
                        const closeIcon = getActionIcon(next.close.action);
                        if (closeIcon?.__editorId === editorId) {
                            setActionIcon(next.close.action, null);
                        }
                    }

                    if ('icon' in next && next.icon?.__editorId === editorId) {
                        next.icon = null;
                    }

                    if (selection?.kind === 'icon' && selection.editorId === editorId) {
                        setSelection(null);
                    }

                    commit(next);
                },

                updateMessageHeader(patch) {
                    if (mode !== 'log') return;
                    const next = { ...draftRef.current } as DraftMessagePayload;
                    next.message = { ...(next.message ?? { text: '' }), ...patch };
                    commit(next as any);
                },

                updateMessageProps(props) {
                    if (mode !== 'log') return;
                    const next = { ...draftRef.current } as DraftMessagePayload;
                    next.props = props ?? undefined;
                    commit(next as any);
                },

                updateMessageExtras(extras) {
                    if (mode !== 'log') return;
                    const next = { ...draftRef.current } as DraftMessagePayload;

                    for (const key of Object.keys(next)) {
                        if (!MESSAGE_RESERVED_KEYS.has(key)) {
                            delete (next as any)[key];
                        }
                    }
                    for (const [key, value] of Object.entries(extras)) {
                        if (!MESSAGE_RESERVED_KEYS.has(key)) {
                            (next as any)[key] = value;
                        }
                    }
                    commit(next as any);
                },

                updateFlashTitle(patch) {
                    if (mode !== 'flash') return;
                    const next = { ...draftRef.current } as DraftFlashPayload;
                    next.title = { ...(next.title ?? { text: '', color: '', weight: '' }), ...patch };
                    commit(next as any);
                },

                updateFlashVariant(variant) {
                    if (mode !== 'flash') return;
                    const next = { ...draftRef.current } as DraftFlashPayload;
                    next.variant = variant;
                    commit(next as any);
                },

                updateFlashActions(patch) {
                    if (mode !== 'flash') return;
                    const next = { ...draftRef.current } as DraftFlashPayload;
                    next.actions = { ...(next.actions ?? { direction: 'x' }), ...patch };
                    commit(next as any);
                },

                updateFlashClose(patch) {
                    if (mode !== 'flash') return;
                    const next = { ...draftRef.current } as DraftFlashPayload;
                    next.close = { ...(next.close ?? { show: false }), ...patch };
                    commit(next as any);
                },

                updateFlashUi(patch) {
                    if (mode !== 'flash') return;
                    const next = { ...draftRef.current } as DraftFlashPayload;
                    next.ui = { ...(next.ui ?? { mode: 'banner', contentMode: 'auto', props: {} }), ...patch };
                    commit(next as any);
                },

                updateEmail(patch) {
                    if (mode !== 'email') return;
                    const next = { ...draftRef.current } as DraftEmailPayload;
                    commit({ ...next, ...patch });
                },

                updateSms(patch) {
                    if (mode !== 'sms') return;
                    const next = { ...draftRef.current } as DraftSmsPayload;
                    commit({ ...next, ...patch });
                },

                updatePush(patch) {
                    if (mode !== 'push') return;
                    const next = { ...draftRef.current } as DraftPushPayload;
                    commit({ ...next, ...patch });
                },

                validate() {
                    const issues: EditorIssue[] = [];

                    if (mode === 'email') {
                        const d = draftRef.current as DraftEmailPayload;
                        if (!d.subject?.trim()) issues.push({ level: 'warning', path: 'subject', message: 'Subject is empty.' });
                        if (!d.message?.trim()) issues.push({ level: 'warning', path: 'message', message: 'Message is empty.' });
                        return issues;
                    }

                    if (mode === 'sms') {
                        const d = draftRef.current as DraftSmsPayload;
                        if (!d.subject?.trim()) issues.push({ level: 'warning', path: 'subject', message: 'Subject is empty.' });
                        if (!d.message?.trim()) issues.push({ level: 'warning', path: 'message', message: 'Message is empty.' });
                        return issues;
                    }

                    if (mode === 'push') {
                        const d = draftRef.current as DraftPushPayload;
                        if (!d.title?.trim()) issues.push({ level: 'warning', path: 'title', message: 'Title is empty.' });
                        if (!d.message?.trim()) issues.push({ level: 'warning', path: 'message', message: 'Message is empty.' });
                        return issues;
                    }

                    const checkActionCore = (core: MessageActionCore, path: string) => {
                        if (core.type === 'route' && !core.route) {
                            issues.push({ level: 'error', path, message: 'Route is required for route actions.' });
                        }
                        if (core.handler === 'blank' && core.route && core.method && core.method.toUpperCase() !== 'GET') {
                            issues.push({ level: 'warning', path, message: 'Blank actions should use GET.' });
                        }
                    };

                    const visitAction = (action: DraftActionPayload, path: string) => {
                        if ('text' in action) {
                            checkActionCore(action.action, `${path}.action`);
                        } else {
                            checkActionCore(action as any, path);
                        }
                    };

                    const cur = draftRef.current;

                    for (const line of cur.messages ?? []) {
                        if (line.action) visitAction(line.action, `messages.${line.__editorId}.action`);
                    }

                    if (Array.isArray(cur.actions)) {
                        for (const action of cur.actions ?? []) {
                            visitAction(action, `actions.${(action as any).__editorId}`);
                        }
                    } else if ('actions' in cur && !Array.isArray(cur.actions)) {
                        if (cur?.actions?.action1) visitAction(cur?.actions?.action1, 'actions.action1');
                        if (cur?.actions?.action2) visitAction(cur?.actions?.action2, 'actions.action2');
                    }

                    if ('close' in cur && cur.close?.action) {
                        visitAction(cur.close.action, 'close.action');
                    }

                    return issues;
                },

                setTestData(data) {
                    setTestData(data);
                },

                toPayload() {
                    if (mode === 'flash') return toFlashPayload(draftRef.current as DraftFlashPayload);
                    if (mode === 'log') return toMessagePayload(draftRef.current as DraftMessagePayload);

                    if (mode === 'email') {
                        const d = draftRef.current as DraftEmailPayload;
                        return { subject: d.subject ?? '', message: d.message ?? '' } as any;
                    }

                    if (mode === 'sms') {
                        const d = draftRef.current as DraftSmsPayload;
                        return { subject: d.subject ?? '', message: d.message ?? '' } as any;
                    }

                    if (mode === 'push') {
                        const d = draftRef.current as DraftPushPayload;
                        return {
                            title: d.title ?? '',
                            message: d.message ?? '',
                            icon: d.icon ?? null,
                            click_action: d.click_action ?? null,
                        } as any;
                    }

                    return toMessagePayload(draftRef.current as DraftMessagePayload);
                },
            };

            return api;
        }, [mode, selection, testData, version]);

        React.useImperativeHandle(ref, () => context, [context]);

        return <EditorContext.Provider value={context}>{children}</EditorContext.Provider>;
    }
);

NotificationTemplateEditor.displayName = 'NotificationTemplateEditor';
