import * as React from 'react';
import type {
    FlashPayload,
    FlashTitlePayload,
    FlashUiMeta,
    MessageActionButton,
    MessageActionCore,
    MessageActionPayload,
    MessageHeaderPayload,
    MessageIconPayload,
    MessageLinePayload,
    MessagePayload,
} from '@/components/ui/feed-renderer.types';

export type EditorMode = 'log' | 'flash' | 'push' | 'email' | 'sms';

export type DraftIconPayload = MessageIconPayload & { __editorId: string };
export type DraftActionCore = MessageActionCore & { icon?: DraftIconPayload | null };
export type DraftActionButton = MessageActionButton & {
    __editorId: string;
    action: DraftActionCore;
    icon?: DraftIconPayload | null;
};
export type DraftActionInline = DraftActionCore & { __editorId: string };
export type DraftActionPayload = DraftActionButton | DraftActionInline;

export type DraftLinePayload = MessageLinePayload & {
    __editorId: string;
    action?: DraftActionPayload;
    icons?: DraftIconPayload[];
};

export type DraftMessagePayload = Omit<MessagePayload, 'messages' | 'actions'> & {
    messages?: DraftLinePayload[];
    actions?: DraftActionPayload[];
};

export type DraftFlashPayload = Omit<FlashPayload, 'messages' | 'actions' | 'icon' | 'close'> & {
    messages: DraftLinePayload[];
    actions: {
        direction: string;
        action1?: DraftActionPayload;
        action2?: DraftActionPayload;
    };
    close: {
        show: boolean;
        action?: DraftActionPayload;
    };
    icon: DraftIconPayload | null;
};

export type EditorSelection = {
    kind: 'icon' | 'action' | 'line';
    editorId: string;
    path?: string;
};

export type EditorIssue = {
    level: 'error' | 'warning';
    path: string;
    message: string;
};

export type AddActionOptions = {
    parent?: { kind: 'message' | 'line' | 'flash' | 'close'; id?: string; slot?: 'action1' | 'action2' };
};

export type AddIconOptions = {
    parent?: { kind: 'line' | 'action' | 'flash'; id?: string };
};

export type DraftEmailPayload = {
    subject?: string;
    message?: string;
};

export type DraftSmsPayload = {
    subject?: string;
    message?: string;
};

export type DraftPushPayload = {
    title?: string;
    message?: string;
    icon?: string | null;
    click_action?: string | null;
};

export type NotificationEditorRef = {
    getDraft(): DraftMessagePayload | DraftFlashPayload | DraftEmailPayload | DraftSmsPayload | DraftPushPayload;
    setDraft(draft: MessagePayload | FlashPayload | DraftEmailPayload | DraftSmsPayload | DraftPushPayload): void;
    setMode(mode: EditorMode): void;
    select(target: EditorSelection): void;
    clearSelection(): void;
    addLine(payload?: Partial<MessageLinePayload>): string;
    updateLine(editorId: string, patch: Partial<MessageLinePayload>): void;
    removeLine(editorId: string): void;
    addAction(payload?: Partial<MessageActionPayload>, opts?: AddActionOptions): string;
    replaceAction(editorId: string, payload: MessageActionPayload): void;
    updateAction(editorId: string, patch: Partial<MessageActionPayload>): void;
    removeAction(editorId: string): void;
    moveAction(editorId: string, direction: 'up' | 'down'): void;
    addIcon(payload?: Partial<MessageIconPayload>, opts?: AddIconOptions): string;
    updateIcon(editorId: string, patch: Partial<MessageIconPayload>): void;
    removeIcon(editorId: string): void;
    updateMessageHeader(patch: Partial<MessageHeaderPayload>): void;
    updateMessageProps(props: Record<string, unknown> | null): void;
    updateMessageExtras(extras: Record<string, unknown>): void;
    updateFlashTitle(patch: Partial<FlashTitlePayload>): void;
    updateFlashVariant(variant: string): void;
    updateFlashActions(patch: Partial<DraftFlashPayload['actions']>): void;
    updateFlashClose(patch: Partial<DraftFlashPayload['close']>): void;
    updateFlashUi(patch: Partial<FlashUiMeta>): void;
    updateEmail: (patch: { subject?: string; message?: string }) => void;
    updateSms: (patch: { subject?: string; message?: string }) => void;
    updatePush: (patch: { title?: string; message?: string; icon?: string | null; click_action?: string | null }) => void;
    validate(): EditorIssue[];
    setTestData(data: Record<string, unknown> | null): void;
    toPayload(): MessagePayload | FlashPayload | DraftEmailPayload | DraftSmsPayload | DraftPushPayload;
};

export type EditorContextValue = NotificationEditorRef & {
    mode: EditorMode;
    draft: DraftMessagePayload | DraftFlashPayload | DraftEmailPayload | DraftSmsPayload | DraftPushPayload;
    selection: EditorSelection | null;
    testData: Record<string, unknown> | null;
};

export type NotificationTemplateEditorProps = {
    mode?: EditorMode;
    draft?: MessagePayload | FlashPayload | DraftEmailPayload | DraftPushPayload | DraftSmsPayload;
    children?: React.ReactNode;
    onChange?: (
        draft: DraftMessagePayload | DraftFlashPayload | DraftEmailPayload | DraftPushPayload | DraftSmsPayload
    ) => void;
    onModeChange?: (mode: EditorMode) => void;
};
