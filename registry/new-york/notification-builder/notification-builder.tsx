import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/smart-button';
import type { EditorMode } from './notification-builder.types';
import {
    NotificationTemplateEditor,
    useNotificationEditor,
} from './notification-builder-context';
import { NotificationBuilderPreview } from './notification-builder-preview';
import { NotificationBuilderInspector } from './notification-builder-inspector';

export {
    NotificationTemplateEditor,
    useNotificationEditor,
    NotificationBuilderPreview,
    NotificationBuilderInspector,
};

/* =========================================================================
 * NotificationBuilderToolbar
 * ========================================================================= */

export interface NotificationBuilderToolbarProps {
    className?: string;
    onSave?: () => void;
    isSaveDirty?: boolean;
    isSaving?: boolean;
    saveLabel?: string;
    supportedModes?: Array<{ label: string; value: EditorMode }>;
}

export const NotificationBuilderToolbar: React.FC<NotificationBuilderToolbarProps> = ({
    className,
    onSave,
    isSaveDirty = false,
    isSaving = false,
    saveLabel = 'Save Changes',
    supportedModes = [
        { label: 'System Log', value: 'log' },
        { label: 'Flash Alert', value: 'flash' },
        { label: 'Email', value: 'email' },
        { label: 'SMS text', value: 'sms' },
        { label: 'Push notice', value: 'push' },
    ],
}) => {
    const editor = useNotificationEditor();

    return (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4", className)}>
            <div className="flex flex-wrap gap-1.5 bg-muted p-1 rounded-lg">
                {supportedModes.map((m) => (
                    <button
                        key={m.value}
                        type="button"
                        onClick={() => editor.setMode(m.value)}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                            editor.mode === m.value
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            {onSave && (
                <Button
                    onClick={onSave}
                    disabled={!isSaveDirty || isSaving}
                    loading={isSaving}
                    size="sm"
                    className="self-end sm:self-auto"
                >
                    {saveLabel}
                </Button>
            )}
        </div>
    );
};

/* =========================================================================
 * NotificationBuilder (Precomposed Visual Builder Dashboard)
 * ========================================================================= */

export interface NotificationBuilderProps {
    className?: string;
    mode?: EditorMode;
    draft?: any;
    onChange?: (draft: any) => void;
    onModeChange?: (mode: EditorMode) => void;
    onSave?: () => void;
    isSaveDirty?: boolean;
    isSaving?: boolean;
    saveLabel?: string;
    emailPreviewUrl?: string | ((templateId?: string | number) => string);
    templateId?: string | number;
    supportedModes?: Array<{ label: string; value: EditorMode }>;
}

export const NotificationBuilder: React.FC<NotificationBuilderProps> = ({
    className,
    mode = 'log',
    draft,
    onChange,
    onModeChange,
    onSave,
    isSaveDirty,
    isSaving,
    saveLabel,
    emailPreviewUrl,
    templateId,
    supportedModes,
}) => {
    return (
        <NotificationTemplateEditor mode={mode} draft={draft} onChange={onChange} onModeChange={onModeChange}>
            <div className={cn("flex flex-col h-full w-full", className)}>
                <NotificationBuilderToolbar
                    onSave={onSave}
                    isSaveDirty={isSaveDirty}
                    isSaving={isSaving}
                    saveLabel={saveLabel}
                    supportedModes={supportedModes}
                />

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                    <div className="lg:col-span-8 overflow-y-auto pr-1">
                        <NotificationBuilderPreview
                            emailPreviewUrl={emailPreviewUrl}
                            templateId={templateId}
                        />
                    </div>
                    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l lg:pl-6 pt-6 lg:pt-0 overflow-y-auto">
                        <NotificationBuilderInspector />
                    </div>
                </div>
            </div>
        </NotificationTemplateEditor>
    );
};
