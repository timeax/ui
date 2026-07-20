import * as React from 'react';
import { cn } from '@/lib/utils';
import { useNotificationEditor } from './notification-builder-context';
import { MessageRenderer, FlashRenderer } from '../feed-renderer/feed-renderer';
import type { MessagePayload, FlashPayload } from '../feed-renderer/feed-renderer.types';

export interface NotificationBuilderPreviewProps {
    className?: string;
    emailPreviewUrl?: string | ((templateId?: string | number) => string);
    templateId?: string | number;
}

export const NotificationBuilderPreview: React.FC<NotificationBuilderPreviewProps> = ({
    className,
    emailPreviewUrl,
    templateId,
}) => {
    const editor = useNotificationEditor();
    const draft = editor.draft;
    const selection = editor.selection;
    const mode = editor.mode;
    const previewRef = React.useRef<HTMLDivElement | null>(null);

    const handlePreviewClick = React.useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;
            const el = target.closest('[data-renderable-kind][data-renderable-id]') as HTMLElement | null;
            if (!el) return;

            event.preventDefault();
            event.stopPropagation();

            const kind = el.dataset.renderableKind as 'line' | 'action' | 'icon' | undefined;
            const editorId = el.dataset.renderableId;

            if (!kind || !editorId) return;
            editor.select({ kind, editorId });
        },
        [editor]
    );

    React.useEffect(() => {
        const root = previewRef.current;
        if (!root) return;
        const nodes = root.querySelectorAll('[data-renderable-id]');
        nodes.forEach((node) => node.removeAttribute('data-renderable-active'));
        if (selection?.editorId) {
            const active = root.querySelector(`[data-renderable-id="${selection.editorId}"]`);
            if (active) active.setAttribute('data-renderable-active', 'true');
        }
    }, [selection, draft]);

    const renderContent = () => {
        if (mode === 'log') {
            return (
                <div className="rounded-xl border border-border bg-card-inner p-4">
                    <MessageRenderer data={draft as MessagePayload} />
                </div>
            );
        }

        if (mode === 'flash') {
            return (
                <div className="rounded-xl border border-border bg-card-inner p-4">
                    <FlashRenderer isPreview data={draft as FlashPayload} />
                </div>
            );
        }

        if (mode === 'email') {
            const d = draft as any;
            if (emailPreviewUrl) {
                const src = typeof emailPreviewUrl === 'function' ? emailPreviewUrl(templateId) : emailPreviewUrl;
                return (
                    <div className="flex flex-col gap-2">
                        <div className="rounded-md border p-2 bg-muted/20 text-xs">
                            <span className="font-semibold">Subject:</span> {d.subject || '(No Subject)'}
                        </div>
                        <iframe title="Email preview" src={src} className="h-[500px] w-full rounded-md border bg-white" />
                    </div>
                );
            }
            return (
                <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
                    <div className="border-b pb-2">
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Email Channel</div>
                        <div className="text-sm font-semibold mt-1">Subject: {d.subject || <span className="text-muted-foreground italic">No Subject</span>}</div>
                    </div>
                    <div className="text-sm text-foreground whitespace-pre-wrap min-h-24">
                        {d.message || <span className="text-muted-foreground italic">No body text</span>}
                    </div>
                </div>
            );
        }

        if (mode === 'sms') {
            const d = draft as any;
            return (
                <div className="mx-auto max-w-sm rounded-3xl border-8 border-muted bg-background p-4 shadow-xl">
                    <div className="text-xs text-muted-foreground text-center pb-2 border-b">SMS Message Preview</div>
                    <div className="mt-4 rounded-2xl bg-muted/40 p-3 text-xs max-w-[85%] self-start relative">
                        <div className="font-semibold mb-1">{d.subject || '(SMS Subject)'}</div>
                        <div className="whitespace-pre-wrap">{d.message || 'SMS content text...'}</div>
                    </div>
                </div>
            );
        }

        if (mode === 'push') {
            const d = draft as any;
            return (
                <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-4 shadow-lg flex gap-3 items-start">
                    {d.icon ? (
                        <img src={d.icon} alt="" className="w-10 h-10 rounded-lg object-contain bg-muted" />
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs">🔔</div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">{d.title || 'Push Title'}</div>
                        <div className="text-xs text-muted-foreground whitespace-pre-wrap mt-0.5">{d.message || 'Push notification text content...'}</div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={cn('relative w-full', className)}>
            <style>{`
                [data-renderable-kind] { cursor: pointer; transition: outline 0.15s ease-in-out; }
                [data-renderable-kind]:hover { outline: 1px dashed hsl(var(--primary)/0.5); outline-offset: 1px; border-radius: 4px; }
                [data-renderable-active="true"] { outline: 2px solid hsl(var(--primary)) !important; outline-offset: 2px; border-radius: 6px; }
            `}</style>
            <div ref={previewRef} onClickCapture={handlePreviewClick} className="w-full">
                {renderContent()}
            </div>
        </div>
    );
};
