import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/smart-button';
import { useNotificationEditor } from './notification-builder-context';
import { findLineById, findActionById, findIconById } from './notification-builder-context';

/* =========================================================================
 * Helper Layout Components
 * ========================================================================= */

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{label}</label>
        {children}
    </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            props.className
        )}
    />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            props.className
        )}
    />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ label: string; value: string }> }> = ({ options, ...props }) => (
    <select
        {...props}
        className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            props.className
        )}
    >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);

const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer">
        <input
            {...props}
            type="checkbox"
            className={cn(
                "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary hover:cursor-pointer",
                props.className
            )}
        />
        <span>{label}</span>
    </label>
);

const InspectorSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 rounded-xl border bg-card p-4 text-card-foreground shadow-xs">
        <div className="border-b pb-2 font-bold text-sm text-foreground uppercase tracking-wider">{title}</div>
        <div className="space-y-4">{children}</div>
    </div>
);

/* =========================================================================
 * Line Properties Inspector
 * ========================================================================= */

export const LineInspector: React.FC = () => {
    const editor = useNotificationEditor();
    const selection = editor.selection;
    const line = selection?.kind === 'line' ? findLineById(editor.draft as any, selection.editorId) : null;

    if (!line) return null;

    return (
        <InspectorSection title="Edit Line Element">
            <Field label="Text Block Content">
                <Textarea
                    value={line.text ?? ''}
                    onChange={(e) => editor.updateLine(line.__editorId, { text: e.target.value })}
                />
            </Field>

            <Field label="Line Formatting Type">
                <Select
                    value={line.type ?? 'none'}
                    options={[
                        { label: 'Default Body text', value: 'none' },
                        { label: 'Title', value: 'title' },
                        { label: 'Subtitle', value: 'subtitle' },
                        { label: 'Emphasis highlighted', value: 'emphasis' },
                        { label: 'Hint / Tip caption', value: 'hint' },
                        { label: 'Meta lowercase caption', value: 'meta' },
                        { label: 'Code Snippet (monospaced)', value: 'code' },
                        { label: 'Keyboard (kbd) chip', value: 'kbd' },
                        { label: 'Tag Pill Badge', value: 'tag' },
                        { label: 'Inline sibling addition', value: 'inline' },
                        { label: 'Bullet list item', value: 'list' },
                    ]}
                    onChange={(e) => {
                        const val = e.target.value;
                        editor.updateLine(line.__editorId, { type: val === 'none' ? null : val });
                    }}
                />
            </Field>

            <Field label="Line Layout Style">
                <Select
                    value={line.iconStyle ?? 'flex'}
                    options={[
                        { label: 'Flex Align Row', value: 'flex' },
                        { label: 'Inline wrapping', value: 'inline' },
                        { label: 'Vertical block', value: 'vertical' },
                    ]}
                    onChange={(e) => {
                        editor.updateLine(line.__editorId, { iconStyle: e.target.value });
                    }}
                />
            </Field>

            <Checkbox
                label="Force render on a new line"
                checked={!!line.newline}
                onChange={(e) => editor.updateLine(line.__editorId, { newline: e.target.checked })}
            />

            <div className="space-y-2 border-t pt-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Icons ({line.icons?.length ?? 0})</div>
                <div className="flex flex-wrap gap-2">
                    {(line.icons ?? []).map((ico: any) => (
                        <Button
                            key={ico.__editorId}
                            size="sm"
                            emphasis={editor.selection?.editorId === ico.__editorId ? 'solid' : 'outline'}
                            onClick={() => editor.select({ kind: 'icon', editorId: ico.__editorId })}
                        >
                            {ico.icon || 'Icon'}
                        </Button>
                    ))}
                    <Button
                        size="sm"
                        emphasis="soft"
                        onClick={() => {
                            const iconId = editor.addIcon(
                                { icon: 'mdi:information-outline', type: 'icon', position: 'left' },
                                { parent: { kind: 'line', id: line.__editorId } }
                            );
                            if (iconId) editor.select({ kind: 'icon', editorId: iconId });
                        }}
                    >
                        + Add Icon
                    </Button>
                </div>
            </div>

            <div className="space-y-2 border-t pt-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Inline Action</div>
                {line.action ? (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => editor.select({ kind: 'action', editorId: (line.action as any).__editorId })}
                        >
                            Edit Action
                        </Button>
                        <Button
                            size="sm"
                            emphasis="outline"
                            tone="danger"
                            onClick={() => editor.removeAction((line.action as any).__editorId)}
                        >
                            Remove Action
                        </Button>
                    </div>
                ) : (
                    <Button
                        size="sm"
                        emphasis="soft"
                        onClick={() => {
                            const actionId = editor.addAction(
                                {
                                    text: 'Learn more',
                                    variant: 'outline',
                                    color: 'primary',
                                    action: {
                                        handler: 'blank',
                                        type: 'route',
                                        method: 'GET',
                                        route: 'https://',
                                        data: null,
                                        props: {},
                                    },
                                } as any,
                                { parent: { kind: 'line', id: line.__editorId } }
                            );
                            if (actionId) editor.select({ kind: 'action', editorId: actionId });
                        }}
                    >
                        + Add Action
                    </Button>
                )}
            </div>
        </InspectorSection>
    );
};

/* =========================================================================
 * Action Properties Inspector
 * ========================================================================= */

export const ActionInspector: React.FC = () => {
    const editor = useNotificationEditor();
    const selection = editor.selection;
    const action = selection?.kind === 'action' ? findActionById(editor.draft as any, selection.editorId) : null;

    if (!action) return null;

    const isBtn = 'text' in action;
    const core = isBtn ? action.action : action;

    const handleUpdate = (patch: any) => {
        editor.updateAction((action as any).__editorId, patch);
    };

    const handleCoreUpdate = (patch: any) => {
        editor.updateAction((action as any).__editorId, {
            action: {
                ...core,
                ...patch,
            },
        });
    };

    return (
        <InspectorSection title="Edit Action Element">
            {isBtn && (
                <Field label="Button Text Label">
                    <Input
                        value={action.text ?? ''}
                        onChange={(e) => handleUpdate({ text: e.target.value })}
                    />
                </Field>
            )}

            <Field label="Action Link / Target Route">
                <Input
                    value={core.route ?? ''}
                    onChange={(e) => handleCoreUpdate({ route: e.target.value })}
                    placeholder="e.g. /dashboard or https://..."
                />
            </Field>

            <Field label="Action Handler Type">
                <Select
                    value={core.handler ?? 'blank'}
                    options={[
                        { label: 'Redirect in new tab (blank)', value: 'blank' },
                        { label: 'Inertia SPA router redirect', value: 'inertia' },
                        { label: 'Async API Request (XHR)', value: 'xhr' },
                        { label: 'Form submission', value: 'form' },
                        { label: 'Client-side Custom event (interact)', value: 'interact' },
                    ]}
                    onChange={(e) => handleCoreUpdate({ handler: e.target.value })}
                />
            </Field>

            {isBtn && (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Visual Variant">
                            <Select
                                value={action.variant ?? 'solid'}
                                options={[
                                    { label: 'Solid background', value: 'solid' },
                                    { label: 'Subtle soft background', value: 'soft' },
                                    { label: 'Outline ring boundary', value: 'outline' },
                                    { label: 'Ghost text button', value: 'ghost' },
                                    { label: 'Simple Text Link', value: 'link' },
                                ]}
                                onChange={(e) => handleUpdate({ variant: e.target.value })}
                            />
                        </Field>
                        <Field label="Color Theme">
                            <Select
                                value={action.color ?? 'primary'}
                                options={[
                                    { label: 'Primary Brand', value: 'primary' },
                                    { label: 'Success green', value: 'success' },
                                    { label: 'Info blue', value: 'info' },
                                    { label: 'Warning amber', value: 'warning' },
                                    { label: 'Danger red', value: 'destructive' },
                                    { label: 'Dark Charcoal (theme)', value: 'theme' },
                                    { label: 'Grey', value: 'grey' },
                                    { label: 'White', value: 'white' },
                                ]}
                                onChange={(e) => handleUpdate({ color: e.target.value })}
                            />
                        </Field>
                    </div>

                    <Checkbox
                        label="Full Width Button block"
                        checked={!!action.fullWidth}
                        onChange={(e) => handleUpdate({ fullWidth: e.target.checked })}
                    />
                </>
            )}

            <Checkbox
                label="Dismiss notification on click"
                checked={!!core.canDismiss}
                onChange={(e) => handleCoreUpdate({ canDismiss: e.target.checked })}
            />
        </InspectorSection>
    );
};

/* =========================================================================
 * Icon Properties Inspector
 * ========================================================================= */

export const IconInspector: React.FC = () => {
    const editor = useNotificationEditor();
    const selection = editor.selection;
    const icon = selection?.kind === 'icon' ? findIconById(editor.draft as any, selection.editorId) : null;

    if (!icon) return null;

    return (
        <InspectorSection title="Edit Icon Element">
            <Field label="Icon Key / Asset Source">
                <Input
                    value={icon.icon ?? ''}
                    onChange={(e) => editor.updateIcon(icon.__editorId, { icon: e.target.value })}
                    placeholder="e.g. lucide:check or /img/my-avatar.png"
                />
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Rendering Engine">
                    <Select
                        value={icon.type ?? 'icon'}
                        options={[
                            { label: 'Icon Font (Iconify)', value: 'icon' },
                            { label: 'Image URL Source', value: 'image' },
                        ]}
                        onChange={(e) => editor.updateIcon(icon.__editorId, { type: e.target.value })}
                    />
                </Field>
                <Field label="Layout Placement">
                    <Select
                        value={icon.position ?? 'left'}
                        options={[
                            { label: 'Left align', value: 'left' },
                            { label: 'Right align', value: 'right' },
                            { label: 'Inline content start', value: 'inline-left' },
                            { label: 'Inline content end', value: 'inline-right' },
                            { label: 'Background overlay', value: 'background' },
                        ]}
                        onChange={(e) => editor.updateIcon(icon.__editorId, { position: e.target.value })}
                    />
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Width Dimension (px)">
                    <Input
                        type="number"
                        value={icon.width ?? ''}
                        onChange={(e) => editor.updateIcon(icon.__editorId, { width: e.target.value ? Number(e.target.value) : null })}
                        placeholder="20"
                    />
                </Field>
                <Field label="Height Dimension (px)">
                    <Input
                        type="number"
                        value={icon.height ?? ''}
                        onChange={(e) => editor.updateIcon(icon.__editorId, { height: e.target.value ? Number(e.target.value) : null })}
                        placeholder="20"
                    />
                </Field>
            </div>

            <Field label="Background color wrapper">
                <Input
                    value={icon.bgColor ?? ''}
                    onChange={(e) => editor.updateIcon(icon.__editorId, { bgColor: e.target.value })}
                    placeholder="e.g. #ef4444 or transparent"
                />
            </Field>

            <Checkbox
                label="Render icon block as full boundary line"
                checked={!!icon.fullLine}
                onChange={(e) => editor.updateIcon(icon.__editorId, { fullLine: e.target.checked })}
            />
        </InspectorSection>
    );
};

/* =========================================================================
 * Channel-Specific Static Inspectors
 * ========================================================================= */

export const EmailInspector: React.FC = () => {
    const editor = useNotificationEditor();
    const d = editor.draft as any;

    return (
        <InspectorSection title="Email Message Settings">
            <Field label="Email Subject Header">
                <Input
                    value={d.subject ?? ''}
                    onChange={(e) => editor.updateEmail({ subject: e.target.value })}
                    placeholder="Your invoice is ready..."
                />
            </Field>
            <Field label="Email Body Message (HTML / Markdown)">
                <Textarea
                    className="min-h-[180px]"
                    value={d.message ?? ''}
                    onChange={(e) => editor.updateEmail({ message: e.target.value })}
                    placeholder="Write body content here..."
                />
            </Field>
        </InspectorSection>
    );
};

export const SmsInspector: React.FC = () => {
    const editor = useNotificationEditor();
    const d = editor.draft as any;

    return (
        <InspectorSection title="SMS Message Settings">
            <Field label="SMS Subject Key">
                <Input
                    value={d.subject ?? ''}
                    onChange={(e) => editor.updateSms({ subject: e.target.value })}
                    placeholder="Billing notice"
                />
            </Field>
            <Field label="SMS Body Text">
                <Textarea
                    className="min-h-[100px]"
                    value={d.message ?? ''}
                    onChange={(e) => editor.updateSms({ message: e.target.value })}
                    placeholder="Your message goes here..."
                />
            </Field>
        </InspectorSection>
    );
};

export const PushInspector: React.FC = () => {
    const editor = useNotificationEditor();
    const d = editor.draft as any;

    return (
        <InspectorSection title="Push Notification Settings">
            <Field label="Notification Title">
                <Input
                    value={d.title ?? ''}
                    onChange={(e) => editor.updatePush({ title: e.target.value })}
                    placeholder="Process complete"
                />
            </Field>
            <Field label="Body Message">
                <Textarea
                    value={d.message ?? ''}
                    onChange={(e) => editor.updatePush({ message: e.target.value })}
                    placeholder="Task completed successfully."
                />
            </Field>
            <Field label="Icon URL Indicator">
                <Input
                    value={d.icon ?? ''}
                    onChange={(e) => editor.updatePush({ icon: e.target.value })}
                    placeholder="https://..."
                />
            </Field>
            <Field label="Destination Action Click Handler">
                <Input
                    value={d.click_action ?? ''}
                    onChange={(e) => editor.updatePush({ click_action: e.target.value })}
                    placeholder="/orders"
                />
            </Field>
        </InspectorSection>
    );
};

/* =========================================================================
 * Message Header & Flash UI Settings Inspectors
 * ========================================================================= */

export const MessageHeaderInspector: React.FC = () => {
    const editor = useNotificationEditor();
    const d = editor.draft as any;
    const header = d.message;

    if (!header) return null;

    return (
        <InspectorSection title="Edit Notice Header">
            <Field label="Header Text Description">
                <Input
                    value={header.text ?? ''}
                    onChange={(e) => editor.updateMessageHeader({ text: e.target.value })}
                />
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Status Color Tone">
                    <Select
                        value={header.color ?? 'primary'}
                        options={[
                            { label: 'Primary Brand', value: 'primary' },
                            { label: 'Success green', value: 'success' },
                            { label: 'Info blue', value: 'info' },
                            { label: 'Warning amber', value: 'warning' },
                            { label: 'Danger red', value: 'destructive' },
                            { label: 'Grey', value: 'grey' },
                            { label: 'White card bg', value: 'white' },
                        ]}
                        onChange={(e) => editor.updateMessageHeader({ color: e.target.value })}
                    />
                </Field>
                <Field label="Style Variant">
                    <Select
                        value={header.variant ?? 'soft'}
                        options={[
                            { label: 'Subtle Soft background', value: 'soft' },
                            { label: 'Filled Solid color', value: 'solid' },
                        ]}
                        onChange={(e) => editor.updateMessageHeader({ variant: e.target.value })}
                    />
                </Field>
            </div>
        </InspectorSection>
    );
};

export const FlashTitleInspector: React.FC = () => {
    const editor = useNotificationEditor();
    const d = editor.draft as any;
    const title = d.title;

    if (!title) return null;

    return (
        <InspectorSection title="Edit Flash Title">
            <Field label="Title text label">
                <Input
                    value={title.text ?? ''}
                    onChange={(e) => editor.updateFlashTitle({ text: e.target.value })}
                />
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Status color tone">
                    <Select
                        value={title.color ?? 'primary'}
                        options={[
                            { label: 'Primary Brand', value: 'primary' },
                            { label: 'Success green', value: 'success' },
                            { label: 'Info blue', value: 'info' },
                            { label: 'Warning amber', value: 'warning' },
                            { label: 'Danger red', value: 'destructive' },
                            { label: 'Grey', value: 'grey' },
                            { label: 'White card bg', value: 'white' },
                        ]}
                        onChange={(e) => editor.updateFlashTitle({ color: e.target.value })}
                    />
                </Field>
                <Field label="Font Weight">
                    <Select
                        value={title.weight ?? 'bold'}
                        options={[
                            { label: 'Bold', value: 'bold' },
                            { label: 'Semi-bold', value: 'semibold' },
                            { label: 'Normal text', value: 'normal' },
                        ]}
                        onChange={(e) => editor.updateFlashTitle({ weight: e.target.value })}
                    />
                </Field>
            </div>

            <div className="border-t pt-3 space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase">UI Mode settings</div>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="UI LayoutMode">
                        <Select
                            value={d.ui?.mode ?? 'banner'}
                            options={[
                                { label: 'Top Banner strip', value: 'banner' },
                                { label: 'Overlay Dialog Card', value: 'dialog' },
                            ]}
                            onChange={(e) => editor.updateFlashUi({ mode: e.target.value })}
                        />
                    </Field>
                    <Field label="Display Mode">
                        <Select
                            value={d.ui?.contentMode ?? 'auto'}
                            options={[
                                { label: 'Self flowing layout', value: 'auto' },
                                { label: 'Center centered overlay', value: 'centered' },
                            ]}
                            onChange={(e) => editor.updateFlashUi({ contentMode: e.target.value })}
                        />
                    </Field>
                </div>
            </div>
        </InspectorSection>
    );
};

/* =========================================================================
 * Layout Inspector Panel Entry Grouping
 * ========================================================================= */

export const NotificationBuilderInspector: React.FC<{ className?: string }> = ({ className }) => {
    const editor = useNotificationEditor();
    const mode = editor.mode;
    const selection = editor.selection;

    const [activeTab, setActiveTab] = React.useState<'config' | 'layer'>('config');

    React.useEffect(() => {
        if (selection) {
            setActiveTab('layer');
        } else {
            setActiveTab('config');
        }
    }, [selection]);

    if (mode === 'email') return <div className={cn("space-y-4", className)}><EmailInspector /></div>;
    if (mode === 'sms') return <div className={cn("space-y-4", className)}><SmsInspector /></div>;
    if (mode === 'push') return <div className={cn("space-y-4", className)}><PushInspector /></div>;

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('config')}
                    className={cn(
                        "flex-1 py-2 text-center text-sm font-semibold border-b-2 transition-colors",
                        activeTab === 'config'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Template Config
                </button>
                <button
                    onClick={() => setActiveTab('layer')}
                    className={cn(
                        "flex-1 py-2 text-center text-sm font-semibold border-b-2 transition-colors",
                        activeTab === 'layer'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Element Properties
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'config' && (
                    <div className="space-y-4">
                        {mode === 'log' && <MessageHeaderInspector />}
                        {mode === 'flash' && <FlashTitleInspector />}
                        
                        <InspectorSection title="Add Layout Elements">
                            <Button
                                className="w-full justify-center"
                                emphasis="soft"
                                onClick={() => {
                                    const lineId = editor.addLine({ text: 'New Line Text', type: 'body' });
                                    if (lineId) editor.select({ kind: 'line', editorId: lineId });
                                }}
                            >
                                + Add Text Line Element
                            </Button>
                        </InspectorSection>
                    </div>
                )}

                {activeTab === 'layer' && (
                    <div className="space-y-4">
                        {selection?.kind === 'line' && <LineInspector />}
                        {selection?.kind === 'action' && <ActionInspector />}
                        {selection?.kind === 'icon' && <IconInspector />}
                        {!selection && (
                            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground bg-muted/20">
                                Click an element in the preview panel to edit its details.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
