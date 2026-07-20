import * as React from 'react';
import { NotificationBuilder } from '../ui/notification-builder/notification-builder';

const initialTemplateData = {
    log: {
        id: 'tpl-log-1',
        message: {
            text: 'User password reset request',
            color: 'info',
            variant: 'soft',
        },
        messages: [
            {
                text: 'We received a request to reset your account password.',
                type: 'body',
                icons: [
                    {
                        icon: 'lucide:key',
                        type: 'icon',
                        position: 'left',
                    },
                ],
            },
            {
                text: 'Requested from IP: 192.168.1.1',
                type: 'meta',
            },
        ],
        actions: [
            {
                text: 'Reset Password',
                variant: 'solid',
                color: 'primary',
                action: {
                    handler: 'blank',
                    type: 'route',
                    route: 'https://example.com/password/reset',
                    method: 'GET',
                    data: null,
                    props: {},
                },
            },
        ],
    },
    flash: {
        id: 'tpl-flash-1',
        title: {
            text: 'Promotional discount active',
            color: 'success',
            weight: 'bold',
        },
        variant: 'success',
        messages: [
            {
                text: 'Get 25% off all plans during our summer sale campaign.',
                type: 'body',
            },
        ],
        actions: {
            direction: 'x',
            action1: {
                text: 'Upgrade Now',
                variant: 'solid',
                color: 'success',
                action: {
                    handler: 'inertia',
                    type: 'route',
                    route: '/billing/upgrade',
                    method: 'GET',
                    data: null,
                    props: {},
                },
            },
        },
        close: {
            show: true,
        },
        icon: {
            icon: 'lucide:gift',
            type: 'icon',
            width: 40,
            height: 40,
        },
        ui: {
            mode: 'banner',
            contentMode: 'auto',
        },
    },
    email: {
        subject: 'Welcome to the platform!',
        message: 'Hi there,\n\nThanks for signing up. Let us know if you need anything!\n\nBest,\nSupport Team',
    },
    sms: {
        subject: 'Security Code',
        message: 'Your verification security code is 283109. Valid for 10 minutes.',
    },
    push: {
        title: 'New message received',
        message: 'Sarah sent you a message: "Hey, are we still meeting today?"',
        icon: '',
        click_action: '/messages',
    },
};

export default function NotificationBuilderDemo() {
    const [drafts, setDrafts] = React.useState<any>(initialTemplateData);
    const [mode, setMode] = React.useState<'log' | 'flash' | 'email' | 'sms' | 'push'>('log');
    const [isDirty, setIsDirty] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    const handleDraftChange = (nextDraft: any) => {
        setDrafts((prev: any) => ({
            ...prev,
            [mode]: nextDraft,
        }));
        setIsDirty(true);
    };

    const handleSave = () => {
        setIsSaving(true);
        console.log('Saving drafts payload:', drafts);
        setTimeout(() => {
            setIsSaving(false);
            setIsDirty(false);
            alert('Saved successfully! Check the console for payload.');
        }, 1000);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-4">
            <div className="border-b pb-2 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Visual Notification Builder Workspace</h1>
                <div className="text-sm text-muted-foreground">Editing Template ID: #TPL-78</div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <NotificationBuilder
                    mode={mode}
                    draft={drafts[mode]}
                    onChange={handleDraftChange}
                    onSave={handleSave}
                    isSaveDirty={isDirty}
                    isSaving={isSaving}
                    supportedModes={[
                        { label: 'System Notice Log', value: 'log' },
                        { label: 'Interactive Flash Banner', value: 'flash' },
                        { label: 'Mail Channel Template', value: 'email' },
                        { label: 'SMS text message', value: 'sms' },
                        { label: 'Push Alert notification', value: 'push' },
                    ]}
                    onModeChange={(nextMode: any) => {
                        setMode(nextMode);
                    }}
                />
            </div>
        </div>
    );
}
