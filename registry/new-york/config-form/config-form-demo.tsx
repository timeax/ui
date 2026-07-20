import * as React from 'react';
import { ConfigForm } from './config-form';
import type {
    UiConfigSchemaPayload,
    SettingsProfile,
    ProfileCreateOption,
    ConfigValidationResult,
} from './config-form.types';

// ==========================================
// Mock Config Schema Payload (config-kit compatible)
// ==========================================

const MOCK_SCHEMA: UiConfigSchemaPayload = {
    settings: {
        credentials: {
            type: 'group',
            label: 'API Credentials',
            tabs: ['connection'],
            children: {
                public_key: {
                    name: 'public_key',
                    label: 'Publishable API Key',
                    type: 'text',
                    required: true,
                    helpText: 'Your public publishable integration key.',
                    tabs: ['connection'],
                },
                secret_key: {
                    name: 'secret_key',
                    label: 'Secret API Key',
                    type: 'password',
                    required: true,
                    secret: true,
                    helpText: 'Stored securely by the application.',
                    tabs: ['connection'],
                },
            },
        },
        connection_timeout: {
            name: 'connection_timeout',
            label: 'Connection Timeout (s)',
            type: 'number',
            default: 30,
            helpText: 'Max duration to wait for API responses.',
            tabs: ['connection'],
            meta: {
                min: 5,
                max: 120,
                step: 5,
            },
        },
        payment_method: {
            name: 'payment_method',
            label: 'Supported Payment Method',
            type: 'select',
            required: true,
            default: 'card',
            isButton: true,
            tabs: ['checkout'],
            options: [
                {
                    value: 'card',
                    label: 'Credit/Debit Card',
                    id: 'payment_card',
                    includes: ['card_statement_descriptor'],
                    excludes: ['bank_account_name'],
                },
                {
                    value: 'bank_transfer',
                    label: 'Direct Bank Transfer',
                    id: 'payment_bank_transfer',
                    includes: ['bank_account_name'],
                    excludes: ['card_statement_descriptor'],
                },
            ],
        },
        card_statement_descriptor: {
            name: 'card_statement_descriptor',
            label: 'Card Statement Descriptor',
            type: 'text',
            tabs: ['checkout'],
            helpText: 'Custom business text displayed on customer bank statements.',
        },
        bank_account_name: {
            name: 'bank_account_name',
            label: 'Receiver Bank Account Name',
            type: 'text',
            tabs: ['checkout'],
            helpText: 'The legal name attached to the deposit account.',
        },
        currency: {
            name: 'currency',
            label: 'Settlement Currency',
            type: 'select',
            required: true,
            default: 'USD',
            tabs: ['checkout'],
            options: [
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' },
                { value: 'NGN', label: 'Nigerian Naira (NGN)' },
                { value: 'GHS', label: 'Ghanaian Cedi (GHS)' },
            ],
        },
        instant_settlement: {
            name: 'instant_settlement',
            label: 'Instant Settlement Mode',
            type: 'toggle',
            default: false,
            tabs: ['checkout'],
            helpText: 'Settle funds instantly (available only for Card payments in NGN or GHS).',
            requires: {
                payment_method: 'card',
                currency: ['NGN', 'GHS'],
            },
        },
        webhook_url: {
            name: 'webhook_url',
            label: 'Webhook Alert URL',
            type: 'url',
            rules: ['nullable', 'url'],
            helpText: 'Endpoint receiving asynchronous event notifications.',
            tabs: ['checkout'],
        },
    },
    tabs: [
        { id: 'connection', label: 'Connection & Setup' },
        { id: 'checkout', label: 'Checkout & Settlement' },
    ],
};

const DEFAULT_VALUES = {
    public_key: 'pk_test_51Nx8Xo...',
    secret_key: '',
    connection_timeout: 30,
    payment_method: 'card',
    card_statement_descriptor: 'TIMEAX INC',
    bank_account_name: '',
    currency: 'USD',
    instant_settlement: false,
    webhook_url: 'https://api.timeax.com/v1/webhook',
};

// ==========================================
// Main Demo Component
// ==========================================

export default function ConfigFormDemo() {
    const [values, setValues] = React.useState<Record<string, any>>(DEFAULT_VALUES);
    const [activeProfile, setActiveProfile] = React.useState('production-eu');
    const [profiles, setProfiles] = React.useState<SettingsProfile[]>([
        {
            id: 1,
            profile: 'production-eu',
            label: 'Production EU',
            is_default: true,
            is_sandbox: false,
            validated_at: '2026-07-20 12:00:00',
        },
        {
            id: 2,
            profile: 'sandbox-staging',
            label: 'Sandbox Staging',
            is_default: false,
            is_sandbox: true,
            validated_at: null,
        },
    ]);

    const [validationResult, setValidationResult] = React.useState<ConfigValidationResult | undefined>(undefined);

    const handleProfileCreate = (name: string) => {
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const newProfile: SettingsProfile = {
            id: profiles.length + 1,
            profile: key,
            label: name,
            is_default: false,
            is_sandbox: key.includes('sandbox') || key.includes('test'),
            validated_at: null,
        };
        setProfiles([...profiles, newProfile]);
        setActiveProfile(key);
    };

    const handleProfileMakeDefault = (key: string) => {
        setProfiles(
            profiles.map((p) => ({
                ...p,
                is_default: p.profile === key,
            }))
        );
    };

    const handleSave = async (submittedValues: Record<string, any>, profile: string) => {
        setValidationResult(undefined);

        // Validation Simulation
        const errors: any = {};
        if (!submittedValues.public_key) {
            errors.public_key = [
                { field: 'public_key', message: 'Publishable API Key is required.', code: 'required' },
            ];
        }
        if (!submittedValues.secret_key) {
            errors.secret_key = [
                { field: 'secret_key', message: 'Secret API Key is required to authorize requests.', code: 'required' },
            ];
        }

        if (Object.keys(errors).length > 0) {
            setValidationResult({ ok: false, errors });
            return;
        }

        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        setValues(submittedValues);
        // Mark profile as validated
        setProfiles(
            profiles.map((p) =>
                p.profile === profile
                    ? { ...p, validated_at: new Date().toISOString().replace('T', ' ').slice(0, 19) }
                    : p
            )
        );
        alert(`Successfully saved configuration changes for profile [${profile}]!`);
    };

    const createOptions: ProfileCreateOption[] = [
        { label: 'Production US', value: 'production-us' },
        { label: 'Sandbox Local', value: 'sandbox-local' },
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Config Schema Adapter Form</h1>
                <p className="text-sm text-muted-foreground">
                    This form parses nested JSON schemas from the backend and translates them to interactive forms using FormPalette elements.
                </p>
            </div>

            <ConfigForm
                schema={MOCK_SCHEMA}
                initialValues={values}
                validationResult={validationResult}
                onSave={handleSave}
                profiles={profiles}
                activeProfile={activeProfile}
                onProfileChange={setActiveProfile}
                onProfileCreate={handleProfileCreate}
                onProfileMakeDefault={handleProfileMakeDefault}
                canCreateProfiles
                createMode="freeform"
                createOptions={createOptions}
                title="Stripe Payment Gateway Configuration"
                description="Configure keys, hooks, supported payouts, and dynamic cedi/naira quick-settlements."
            />

            <Card className="p-5 border bg-muted/30">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Saved Stored State ({activeProfile})
                </h3>
                <pre className="text-xs font-mono bg-background border rounded-lg p-4 overflow-x-auto text-foreground/90 max-h-56">
                    {JSON.stringify(values, null, 2)}
                </pre>
            </Card>
        </div>
    );
}
