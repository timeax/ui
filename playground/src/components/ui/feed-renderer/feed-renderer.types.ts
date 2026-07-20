export type MessageLineType =
    | 'title'
    | 'subtitle'
    | 'body'
    | 'emphasis'
    | 'hint'
    | 'meta'
    | 'code'
    | 'kbd'
    | 'tag'
    | 'inline'
    | 'list';

export type MessageIconPosition = 'left' | 'right' | 'inline-left' | 'inline-right' | 'background' | string;

export type MessageIconType = 'icon' | 'image' | string;

export interface MessageIconPayload {
    icon: string;
    width?: number | null;
    height?: number | null;
    fullLine?: boolean | null;
    bgColor?: string | null;
    position?: MessageIconPosition | null;
    type?: MessageIconType | null;
    props?: Record<string, unknown>;
    __editorId?: string; // used internally by the builder
}

export interface MessageActionCore {
    method: string | null;
    handler: 'inertia' | 'form' | 'xhr' | 'blank' | 'interact' | string;
    data: Record<string, unknown> | null;
    route: string | null;
    type: 'route' | 'interact' | string;
    props: Record<string, unknown>;
    icon?: MessageIconPayload | null;
    fullWidth?: boolean | null;
    canDismiss?: boolean | null;
    __editorId?: string; // used internally by the builder
}

export interface MessageActionButton {
    text: string;
    variant: string | null;
    color: string | null;
    weight: string | null;
    action: MessageActionCore;
    icon?: MessageIconPayload | null;
    fullWidth?: boolean | null;
    canDismiss?: boolean | null;
    __editorId?: string; // used internally by the builder
}

export type MessageActionInline = MessageActionCore;

export type MessageActionPayload = MessageActionButton | MessageActionInline;

export interface MessageLinePayload {
    text: string;
    weight?: string | null;
    color?: string | null;
    type?: MessageLineType | string | null;
    newline?: boolean;
    props?: Record<string, unknown>;
    action?: MessageActionPayload;
    icons?: MessageIconPayload[];
    iconStyle?: 'inline' | 'vertical' | 'flex' | string | null;
    __editorId?: string; // used internally by the builder
}

export interface MessageHeaderPayload {
    text: string;
    color?: string;
    variant?: string;
}

export interface MessagePayload {
    id: string;
    message: MessageHeaderPayload;
    props?: Record<string, unknown>;
    messages?: MessageLinePayload[];
    actions?: MessageActionPayload[];
    [key: string]: unknown;
}

export interface FlashTitlePayload {
    text: string;
    color: string;
    weight: string;
}

export interface FlashActionsBlock {
    direction: string; // 'x', 'y'
    action1?: MessageActionPayload;
    action2?: MessageActionPayload;
}

export interface FlashCloseBlock {
    show: boolean;
    action?: MessageActionPayload;
}

export type FlashIconBlock = MessageIconPayload | null;

export interface FlashUiMeta {
    mode: 'dialog' | 'banner' | string;
    contentMode: 'centered' | 'auto' | string;
    props?: Record<string, unknown>;
}

export interface FlashPayload {
    id: string;
    title: FlashTitlePayload;
    variant?: string;
    messages: MessageLinePayload[];
    actions: FlashActionsBlock;
    close: FlashCloseBlock;
    icon: FlashIconBlock;
    ui?: FlashUiMeta;
}
