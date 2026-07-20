import {
    MessageRenderer,
    FlashRenderer,
    LoggerProvider,
    useLogger,
    MessageFeed,
    FlashFeed,
} from './feed-renderer';
import type { MessagePayload, FlashPayload } from './feed-renderer.types';

const sampleMessage: MessagePayload = {
    id: 'demo-message',
    message: {
        text: 'Payment received successfully',
        color: 'success',
        variant: 'soft',
    },
    messages: [
        {
            text: 'Thank you for your order. We are processing your request.',
            type: 'body',
            icons: [
                {
                    icon: 'lucide:check-circle',
                    type: 'icon',
                    position: 'left',
                },
            ],
        },
        {
            text: 'Transaction Reference: #TXN-98213-A',
            type: 'meta',
        },
    ],
    actions: [
        {
            text: 'View Receipt',
            variant: 'solid',
            color: 'primary',
            weight: null,
            action: {
                handler: 'blank',
                type: 'route',
                route: '/orders/receipt',
                method: 'GET',
                data: null,
                props: {},
                fullWidth: false,
                canDismiss: false,
            },
        },
    ],
};

const sampleFlash: FlashPayload = {
    id: 'demo-flash',
    title: {
        text: 'System Update Complete',
        color: 'info',
        weight: 'bold',
    },
    variant: 'info',
    messages: [
        {
            text: 'Version 3.4.0 contains security patches.',
            type: 'body',
        },
        {
            text: 'Deployed by: Site Admin',
            type: 'meta',
        },
    ],
    actions: {
        direction: 'x',
        action1: {
            text: 'Changelog',
            variant: 'outline',
            color: 'grey',
            weight: null,
            action: {
                handler: 'inertia',
                type: 'route',
                route: '/admin/updates',
                method: 'GET',
                data: null,
                props: {},
                fullWidth: false,
                canDismiss: false,
            },
        },
        action2: {
            text: 'Acknowledge',
            variant: 'solid',
            color: 'primary',
            weight: null,
            action: {
                handler: 'xhr',
                type: 'interact',
                route: '/admin/acknowledge',
                method: 'POST',
                data: { ok: true },
                props: {},
                fullWidth: false,
                canDismiss: true,
            },
        },
    },
    close: {
        show: true,
    },
    icon: {
        icon: 'lucide:info',
        type: 'icon',
        width: 40,
        height: 40,
    },
    ui: {
        mode: 'banner',
        contentMode: 'auto',
        props: {},
    },
};

function LoggerActionsDemo() {
    const logger = useLogger();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">4. Programmatic Logger Trigger (Context State)</h2>
            <div className="flex flex-wrap gap-3 p-4 rounded-xl border bg-card">
                <button
                    onClick={() => logger.success('Saved all project changes successfully!')}
                    className="inline-flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm font-medium hover:cursor-pointer shadow-sm transition-colors"
                >
                    Trigger Success Toast
                </button>
                <button
                    onClick={() => logger.error('Connection timed out. Please try again.')}
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm font-medium hover:cursor-pointer shadow-sm transition-colors"
                >
                    Trigger Error Toast
                </button>
                <button
                    onClick={() =>
                        logger.info('System updates will occur at 02:00 UTC.', {
                            kind: 'flash',
                            ui: { mode: 'banner' },
                        })
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 text-sm font-medium hover:cursor-pointer shadow-sm transition-colors"
                >
                    Trigger Flash Banner
                </button>
                <button
                    onClick={() =>
                        logger.warning('Are you sure you want to delete this resource?', {
                            kind: 'flash',
                            ui: { mode: 'dialog' },
                        })
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 text-sm font-medium hover:cursor-pointer shadow-sm transition-colors"
                >
                    Trigger Flash Dialog
                </button>
                <button
                    onClick={() => logger.clear()}
                    className="inline-flex items-center gap-2 rounded-md border border-input hover:bg-accent text-accent-foreground px-3 py-2 text-sm font-medium hover:cursor-pointer shadow-sm transition-colors"
                >
                    Clear All Feed Feeds
                </button>
            </div>

            {/* Mount Feeds directly here inside Provider */}
            <MessageFeed position="top-right" />
            <FlashFeed />
        </div>
    );
}

export default function FeedRendererDemo() {
    return (
        <div className="p-6 space-y-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold border-b pb-2">Feed Renderers Demo</h1>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-muted-foreground">1. Message Renderer (Toasts/Logs)</h2>
                <MessageRenderer
                    data={sampleMessage}
                    onDismiss={() => alert('Dismissed toast')}
                    onActionClick={(action) => alert(`Action Clicked: ${action.route}`)}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-muted-foreground">2. Flash Alert Banner</h2>
                <FlashRenderer
                    isPreview
                    data={sampleFlash}
                    onDismiss={() => alert('Dismissed flash banner')}
                    onActionClick={(action) => alert(`Action Clicked: ${action.route}`)}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-muted-foreground">3. Flash Alert Dialog (Modal Preview)</h2>
                <FlashRenderer
                    isPreview
                    data={{
                        ...sampleFlash,
                        ui: { mode: 'dialog', contentMode: 'centered' }
                    }}
                    onDismiss={() => alert('Closed dialog')}
                    onActionClick={(action) => alert(`Action Clicked: ${action.route}`)}
                />
            </div>

            <LoggerProvider>
                <LoggerActionsDemo />
            </LoggerProvider>
        </div>
    );
}
