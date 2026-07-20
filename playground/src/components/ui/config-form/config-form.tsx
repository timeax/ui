import * as React from 'react';
import { Form, InputField, useButton as useFormButton } from '@timeax/form-palette';
import { Button } from '@/components/ui/smart-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/enhanced-tabs/enhanced-tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
    Activity,
    AlertTriangle,
    Check,
    CheckCircle2,
    ChevronDown,
    Plus,
    Search,
    ShieldCheck,
    Sliders,
    Star,
} from 'lucide-react';
import type {
    ConfigField,
    ConfigGroup,
    ConfigNode,
    ConfigOption,
    ConfigTab,
    ConfigRequires,
    FlattenedField,
    UiConfigSchemaPayload,
    VisibilityContext,
    SettingsProfile,
    ProfileCreateOption,
    ConfigValidationResult,
} from './config-form.types';

// ==========================================
// Requirement Rules Evaluation Logic
// ==========================================

function normalize(value: any): string {
    if (typeof value === 'boolean') {
        return value ? '1' : '0';
    }
    if (value === null || value === undefined) {
        return '';
    }
    return String(value);
}

function same(left: any, right: any): boolean {
    return normalize(left) === normalize(right);
}

function matchesExpected(value: any, expected: any): boolean {
    if (Array.isArray(value)) {
        return value.some((item) => same(item, expected));
    }
    return same(value, expected);
}

function matchesAny(value: any, expected: any): boolean {
    const expectedValues = Array.isArray(expected) ? expected : [expected];
    return expectedValues.some((item) => matchesExpected(value, item));
}

function isFilled(value: any): boolean {
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
}

function matchesRegex(value: any, pattern: string): boolean {
    let reg: RegExp;
    try {
        if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) {
            const lastSlash = pattern.lastIndexOf('/');
            const expr = pattern.slice(1, lastSlash);
            const flags = pattern.slice(lastSlash + 1);
            reg = new RegExp(expr, flags);
        } else {
            reg = new RegExp(pattern);
        }
    } catch {
        return false;
    }
    const values = Array.isArray(value) ? value : [value];
    return values.some((item) => reg.test(normalize(item)));
}

const OPERATORS = ['equals', 'not', 'in', 'notIn', 'filled', 'empty', 'regex'] as const;
type Operator = typeof OPERATORS[number];

function isOperatorObject(condition: any): condition is Record<Operator, any> {
    if (!condition || typeof condition !== 'object' || Array.isArray(condition)) {
        return false;
    }
    const keys = Object.keys(condition);
    if (keys.length === 0) return false;
    return keys.every((key) => OPERATORS.includes(key as Operator));
}

function hasStringKeys(condition: any): boolean {
    if (!condition || typeof condition !== 'object' || Array.isArray(condition)) {
        return false;
    }
    return Object.keys(condition).length > 0;
}

function operatorMatches(operator: Operator, exists: boolean, value: any, expected: any): boolean {
    switch (operator) {
        case 'equals':
            return exists && matchesExpected(value, expected);
        case 'not':
            return exists && !matchesExpected(value, expected);
        case 'in':
            return exists && matchesAny(value, expected);
        case 'notIn':
            return exists && !matchesAny(value, expected);
        case 'filled':
            return exists && isFilled(value) === Boolean(expected);
        case 'empty':
            return !exists || !isFilled(value);
        case 'regex':
            return exists && typeof expected === 'string' && matchesRegex(value, expected);
        default:
            return false;
    }
}

function conditionMatches(exists: boolean, value: any, condition: any): boolean {
    if (isOperatorObject(condition)) {
        return Object.entries(condition).every(([op, expected]) =>
            operatorMatches(op as Operator, exists, value, expected)
        );
    }
    if (hasStringKeys(condition)) {
        return false;
    }
    if (Array.isArray(condition)) {
        return operatorMatches('in', exists, value, condition);
    }
    return operatorMatches('equals', exists, value, condition);
}

export function evaluateRequires(requires: ConfigRequires | undefined, values: Record<string, any>): boolean {
    if (!requires || Object.keys(requires).length === 0) {
        return true;
    }
    return Object.entries(requires).every(([key, condition]) => {
        const exists = key in values;
        const value = values[key];
        return conditionMatches(exists, value, condition);
    });
}

// ==========================================
// Schema Normalization & Helpers
// ==========================================

export function isInputGroup(node: ConfigNode): node is ConfigGroup {
    return !!node && typeof node === 'object' && (node as any).type === 'group';
}

export function isInputLeaf(node: ConfigNode): node is ConfigField {
    return !!node && typeof node === 'object' && (node as any).type !== 'group';
}

function normalizeStringArray(value: any): string[] {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item)).filter((item) => item.length > 0);
}

export function normalizeNode(rawNode: any, fallbackKey = ''): ConfigNode {
    if (rawNode && typeof rawNode === 'object' && rawNode.type === 'group') {
        const children = normalizeNodeRecord(rawNode.children);
        return {
            type: 'group',
            label: rawNode.label ?? fallbackKey,
            required: rawNode.required ?? false,
            tabs: normalizeStringArray(rawNode.tabs),
            includes: normalizeStringArray(rawNode.includes),
            excludes: normalizeStringArray(rawNode.excludes),
            meta: rawNode.meta ?? {},
            excludedFromProfiles: normalizeStringArray(rawNode.excludedFromProfiles),
            requires: rawNode.requires ?? {},
            children,
        };
    }

    const name = rawNode?.name ?? rawNode?.key ?? fallbackKey;
    return {
        ...rawNode,
        name,
        label: rawNode?.label ?? name,
        type: rawNode?.type ?? 'text',
        required: rawNode?.required ?? false,
        secret: rawNode?.secret ?? false,
        rules: normalizeStringArray(rawNode?.rules),
        default: rawNode?.default ?? null,
        helpText: rawNode?.helpText ?? null,
        options: Array.isArray(rawNode?.options) ? rawNode.options : [],
        sandbox: Boolean(rawNode?.sandbox),
        meta: rawNode?.meta ?? {},
        group: rawNode?.group ?? null,
        tabs: normalizeStringArray(rawNode?.tabs),
        isButton: Boolean(rawNode?.isButton),
        includes: normalizeStringArray(rawNode?.includes),
        excludes: normalizeStringArray(rawNode?.excludes),
        excludedFromProfiles: normalizeStringArray(rawNode?.excludedFromProfiles),
        requires: rawNode?.requires ?? {},
    };
}

export function normalizeNodeRecord(raw: any): Record<string, ConfigNode> {
    if (!raw) return {};
    if (Array.isArray(raw)) {
        return Object.fromEntries(
            raw.map((node, i) => {
                const key = node?.name ?? node?.key ?? String(i);
                return [key, normalizeNode(node, key)];
            })
        );
    }
    if (typeof raw === 'object') {
        return Object.fromEntries(
            Object.entries(raw).map(([key, node]) => [key, normalizeNode(node, key)])
        );
    }
    return {};
}

export function flattenInputLeaves(input: Record<string, ConfigNode>, prefix: string | null = null): FlattenedField[] {
    const output: FlattenedField[] = [];
    const walk = (node: ConfigNode, key: string, basePrefix: string | null) => {
        if (isInputGroup(node)) {
            const nextPrefix = basePrefix ? `${basePrefix}.${key}` : key;
            Object.entries(node.children).forEach(([childKey, childNode]) => {
                walk(childNode, childKey, nextPrefix);
            });
            return;
        }
        const leaf = node as ConfigField;
        const fieldKey = leaf.name ?? key;
        const path = basePrefix ? `${basePrefix}.${fieldKey}` : fieldKey;
        output.push({
            path,
            fieldName: fieldKey,
            key: fieldKey,
            node: leaf,
        });
    };
    Object.entries(input).forEach(([key, node]) => {
        walk(node, key, prefix);
    });
    return output;
}

export function buildVisibilityContext(
    settings: Record<string, ConfigNode>,
    values: Record<string, any>,
    activeTabIds: string[] = []
): VisibilityContext {
    const activeTokens = new Set<string>();
    const optionIncludes = new Set<string>();
    const optionExcludes = new Set<string>();

    activeTabIds.forEach((tabId) => {
        if (tabId) activeTokens.add(tabId);
    });

    const leaves = flattenInputLeaves(settings);
    leaves.forEach((entry) => {
        const leaf = entry.node;
        const fieldName = entry.fieldName;
        const value = values[fieldName] ?? null;

        if (leaf.isButton && Boolean(value)) {
            activeTokens.add(fieldName);
        }

        const options = leaf.options ?? [];
        if (options.length === 0) return;

        const selectedOptions = findSelectedOptions(options, value);
        selectedOptions.forEach((option) => {
            if (option.id) activeTokens.add(option.id);
            normalizeStringArray(option.includes).forEach((inc) => optionIncludes.add(inc));
            normalizeStringArray(option.excludes).forEach((exc) => optionExcludes.add(exc));
        });
    });

    return { activeTokens, optionIncludes, optionExcludes };
}

function findSelectedOptions(options: ConfigOption[], value: any): ConfigOption[] {
    const selected: ConfigOption[] = [];
    const stack = [...options];
    const selectedValues = new Set<string>();

    if (Array.isArray(value)) {
        value.forEach((v) => selectedValues.add(String(v)));
    } else if (value !== null && value !== undefined && value !== '') {
        selectedValues.add(String(value));
    }

    while (stack.length > 0) {
        const option = stack.shift()!;
        if (selectedValues.has(String(option.value)) || selectedValues.has(String(option.id ?? ''))) {
            selected.push(option);
        }
        if (option.children?.length) {
            stack.push(...option.children);
        }
    }
    return selected;
}

export function isNodeVisible(
    node: ConfigNode | ConfigTab,
    context: VisibilityContext,
    values: Record<string, any>,
    extra: { includes?: string[]; excludes?: string[] } = {},
    allOptionIncludes: Set<string> = new Set()
): boolean {
    if ('requires' in node && !evaluateRequires(node.requires, values)) {
        return false;
    }

    const fieldName = 'name' in node ? node.name : 'id' in node ? node.id : '';

    if (fieldName && context.optionExcludes.has(fieldName)) {
        return false;
    }

    if (fieldName && allOptionIncludes.has(fieldName) && !context.optionIncludes.has(fieldName)) {
        return false;
    }

    const includes = [
        ...normalizeStringArray((node as any).includes),
        ...normalizeStringArray(extra.includes),
    ];
    const excludes = [
        ...normalizeStringArray((node as any).excludes),
        ...normalizeStringArray(extra.excludes),
    ];

    if (excludes.some((cand) => context.activeTokens.has(cand))) {
        return false;
    }

    if (includes.length > 0 && !includes.some((cand) => context.activeTokens.has(cand))) {
        return false;
    }

    return true;
}

export function isNodeInActiveTabs(node: ConfigNode, activeTabIds: Set<string>): boolean {
    const tabs = normalizeStringArray((node as any).tabs);
    if (activeTabIds.size === 0) return true;
    if (tabs.length === 0) return true;
    return tabs.some((tab) => activeTabIds.has(tab));
}

// ==========================================
// Field Prop Mapper
// ==========================================

function forbidSensitive(leaf: ConfigField): void {
    if (leaf.secret) {
        throw new Error(`"${leaf.label}" (${leaf.type}) cannot be sensitive/secret`);
    }
}

export function getInputProps(leaf: ConfigField): { variant: string; props: Record<string, any> } {
    const baseProps: Record<string, any> = {
        label: leaf.label,
        description: leaf.meta?.description,
        required: leaf.required ?? false,
        defaultValue: leaf.default ?? null,
        disabled: leaf.meta?.disabled ?? false,
        readOnly: leaf.meta?.readOnly ?? false,
        name: leaf.name,
        placeholder: leaf.meta?.placeholder ?? '',
        ...leaf.meta,
    };

    switch (leaf.type as any) {
        case 'password':
            return { variant: 'password', props: baseProps };
        case 'text':
            if (leaf.secret) return { variant: 'password', props: baseProps };
            return { variant: 'text', props: { ...baseProps, type: 'text' } };
        case 'email':
            if (leaf.secret) return { variant: 'password', props: baseProps };
            return { variant: 'text', props: { ...baseProps, type: 'email' } };
        case 'url':
            if (leaf.secret) return { variant: 'password', props: baseProps };
            return { variant: 'text', props: { ...baseProps, type: 'url' } };
        case 'search':
            if (leaf.secret) return { variant: 'password', props: baseProps };
            return { variant: 'text', props: { ...baseProps, type: 'search' } };
        case 'tel':
            if (leaf.secret) return { variant: 'password', props: baseProps };
            return { variant: 'phone', props: baseProps };
        case 'number':
            return { variant: 'number', props: baseProps };
        case 'range':
            return { variant: 'slider', props: baseProps };
        case 'switch':
        case 'toggle':
            return { variant: 'toggle', props: baseProps };
        case 'tristate':
            forbidSensitive(leaf);
            return {
                variant: 'checkbox',
                props: {
                    ...baseProps,
                    options: leaf.options ?? [],
                    tristate: true,
                    disabled: (leaf.options?.length ?? 0) > 0 ? baseProps.disabled : true,
                },
            };
        case 'checkbox': {
            const options = leaf.options ?? [];
            if (options.length > 0) {
                forbidSensitive(leaf);
                return {
                    variant: 'checkbox',
                    props: {
                        ...baseProps,
                        options,
                        tristate: Boolean(leaf.meta?.tristate),
                    },
                };
            }
            const { label, ...rest } = baseProps;
            return {
                variant: 'checkbox',
                props: {
                    ...rest,
                    single: true,
                    singleLabel: leaf.label,
                },
            };
        }
        case 'radio':
            forbidSensitive(leaf);
            return {
                variant: 'radio',
                props: {
                    ...baseProps,
                    options: leaf.options ?? [],
                    disabled: (leaf.options?.length ?? 0) > 0 ? baseProps.disabled : true,
                },
            };
        case 'select':
            forbidSensitive(leaf);
            return {
                variant: 'select',
                props: {
                    ...baseProps,
                    options: leaf.options ?? [],
                    disabled: (leaf.options?.length ?? 0) > 0 ? baseProps.disabled : true,
                    placeholder: leaf.meta?.placeholder || leaf.meta?.emptyPlaceholder || 'Select an option',
                },
            };
        case 'multiselect':
            forbidSensitive(leaf);
            return {
                variant: 'multi-select',
                props: {
                    ...baseProps,
                    options: leaf.options ?? [],
                    disabled: (leaf.options?.length ?? 0) > 0 ? baseProps.disabled : true,
                    placeholder: leaf.meta?.placeholder || leaf.meta?.emptyPlaceholder || 'Select multiple options',
                },
            };
        case 'chips':
            forbidSensitive(leaf);
            return { variant: 'chips', props: baseProps };
        case 'date':
            return { variant: 'date', props: { ...baseProps, kind: leaf.meta?.kind ?? 'date' } };
        case 'time':
            return { variant: 'date', props: { ...baseProps, kind: leaf.meta?.kind ?? 'time' } };
        case 'datetime-local':
            return { variant: 'date', props: { ...baseProps, kind: leaf.meta?.kind ?? 'datetime' } };
        case 'month':
            return { variant: 'date', props: { ...baseProps, kind: leaf.meta?.kind ?? 'monthYear' } };
        case 'week':
            return { variant: 'text', props: { ...baseProps, type: 'week' } };
        case 'color':
            return { variant: 'color', props: baseProps };
        case 'file':
            return { variant: 'file', props: baseProps };
        case 'json':
            return { variant: 'json-editor', props: baseProps };
        default:
            return { variant: leaf.type ?? 'text', props: baseProps };
    }
}

function pickEventValue(event: any): any {
    if (event?.detail?.selectedOptions && Array.isArray(event.detail.selectedOptions)) {
        return event.detail.selectedOptions
            .map((opt: any) => opt?.value ?? opt?.id)
            .filter((v: any) => v !== undefined);
    }
    if (event?.detail?.value !== undefined) return event.detail.value;
    if (event?.value !== undefined) return event.value;
    if (event?.target?.value !== undefined) return event.target.value;
    if (event?.target?.checked !== undefined) return Boolean(event.target.checked);
    return event;
}

// ==========================================
// Submit Button Component
// ==========================================

const SubmitButton: React.FC<{
    name?: string;
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}> = ({ name = 'default', disabled, loading, children }) => {
    const hb = useFormButton({
        name,
        submit: true,
        disabled,
    });

    React.useEffect(() => {
        if (loading !== undefined) hb.setLoading(loading);
    }, [loading, hb]);

    React.useEffect(() => {
        if (disabled !== undefined) hb.setDisabled(disabled);
    }, [disabled, hb]);

    return (
        <Button
            type="button"
            loading={hb.loading}
            disabled={hb.disabled}
            onClick={(e) => hb.onClick(e)}
            tone="primary"
            size="sm"
            className="h-9 px-4 rounded-lg"
        >
            {children}
        </Button>
    );
};

// ==========================================
// Presentation Header Component
// ==========================================

interface ConfigFormHeaderProps {
    requiredCount: number;
    requiredFilledCount: number;
    isSensitive: boolean;
    title: string;
    description?: string;
    profile?: SettingsProfile | null;
    profiles?: SettingsProfile[];
    canCreateProfiles?: boolean;
    createMode?: 'freeform' | 'handler';
    createOptions?: ProfileCreateOption[];
    onProfileChange?: (profile: string) => void;
    onProfileCreate?: (profile: string) => Promise<void> | void;
    onProfileMakeDefault?: (profile: string) => Promise<void> | void;
    searchQuery?: string;
    onSearchQueryChange?: (value: string) => void;
}

export const ConfigFormHeader: React.FC<ConfigFormHeaderProps> = ({
    requiredCount,
    requiredFilledCount,
    isSensitive,
    title,
    description,
    profile,
    profiles = [],
    canCreateProfiles = false,
    createMode = 'freeform',
    createOptions = [],
    onProfileChange,
    onProfileCreate,
    onProfileMakeDefault,
    searchQuery = '',
    onSearchQueryChange,
}) => {
    const missingCount = requiredCount - requiredFilledCount;
    const isComplete = missingCount === 0;
    const progressPercent = requiredCount > 0 ? (requiredFilledCount / requiredCount) * 100 : 100;

    const [createOpen, setCreateOpen] = React.useState(false);
    const [createValue, setCreateValue] = React.useState('');
    const [createBusy, setCreateBusy] = React.useState(false);
    const [defaultBusy, setDefaultBusy] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);

    const shouldShowSearch = typeof onSearchQueryChange === 'function';

    React.useEffect(() => {
        if (createMode === 'handler' && createOptions.length > 0 && createValue === '') {
            setCreateValue(createOptions[0].value);
        }
    }, [createMode, createOptions, createValue]);

    React.useEffect(() => {
        if (searchQuery.trim().length > 0) {
            setSearchOpen(true);
        }
    }, [searchQuery]);

    const currentProfileLabel = profile?.label ?? 'Global';

    async function handleCreateProfile() {
        if (!onProfileCreate) return;
        const nextValue = createValue.trim();
        if (nextValue === '') return;

        setCreateBusy(true);
        try {
            await onProfileCreate(nextValue);
            setCreateOpen(false);
            if (createMode === 'freeform') {
                setCreateValue('');
            }
        } finally {
            setCreateBusy(false);
        }
    }

    async function handleMakeDefault() {
        if (!profile || profile.is_default || !onProfileMakeDefault) return;

        setDefaultBusy(true);
        try {
            await onProfileMakeDefault(profile.profile);
        } finally {
            setDefaultBusy(false);
        }
    }

    return (
        <>
            <div
                className={cn(
                    'overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-colors duration-300',
                    isComplete
                        ? 'border-border'
                        : 'border-warning/30 bg-warning/5'
                )}
            >
                <div className="p-6">
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div className="flex gap-4">
                            <div
                                className={cn(
                                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300',
                                    isComplete
                                        ? 'border-border bg-muted text-muted-foreground'
                                        : 'border-warning/20 bg-warning/10 text-warning'
                                )}
                            >
                                {isComplete ? <Sliders className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
                            </div>

                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
                                {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}

                                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                    {isSensitive && (
                                        <span className="flex items-center gap-1 rounded-full border border-warning/20 bg-warning/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-warning uppercase">
                                            <ShieldCheck className="h-3 w-3" /> Sensitive Data
                                        </span>
                                    )}

                                    {profile && (
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        emphasis="outline"
                                                        size="sm"
                                                        contentClassName="flex items-center gap-1.5"
                                                        className="h-7 rounded-full px-3 text-xs font-semibold"
                                                    >
                                                        <span>{currentProfileLabel}</span>
                                                        {profile.is_default && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />}
                                                        <ChevronDown className="h-3 w-3 opacity-60" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="min-w-56">
                                                    <DropdownMenuLabel>Settings Profiles</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {profiles.map((item) => (
                                                        <DropdownMenuItem
                                                            key={item.id}
                                                            onClick={() => onProfileChange?.(item.profile)}
                                                            className="justify-between cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span>{item.label}</span>
                                                                {item.is_default && <Star className="h-3 w-3 fill-amber-400 text-amber-500" />}
                                                            </div>
                                                            {item.profile === profile.profile && <Check className="h-4 w-4 text-primary" />}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    {!profile.is_default && onProfileMakeDefault && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => void handleMakeDefault()} disabled={defaultBusy} className="cursor-pointer text-xs font-semibold">
                                                                {defaultBusy ? 'Updating...' : 'Make Default'}
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            {canCreateProfiles && (
                                                <Button
                                                    emphasis="outline"
                                                    size="icon-sm"
                                                    className="h-7 w-7 rounded-full"
                                                    onClick={() => setCreateOpen(true)}
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {shouldShowSearch && (
                                        <div className="ml-auto flex items-center">
                                            <div
                                                className={cn(
                                                    'overflow-hidden rounded-full border border-border/70 bg-background/50 hover:bg-background/80 transition-all duration-200',
                                                    searchOpen ? 'w-[200px] opacity-100' : 'w-8 opacity-90'
                                                )}
                                            >
                                                {searchOpen ? (
                                                    <div className="relative flex items-center w-full">
                                                        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                                        <Input
                                                            value={searchQuery}
                                                            autoFocus
                                                            placeholder="Search fields"
                                                            className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-8 pr-2 py-0 w-full text-xs"
                                                            onChange={(event) => onSearchQueryChange?.(event.target.value)}
                                                            onBlur={() => {
                                                                if (searchQuery.trim().length === 0) {
                                                                    setSearchOpen(false);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                                                        aria-label="Search settings"
                                                        onClick={() => setSearchOpen(true)}
                                                    >
                                                        <Search className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {requiredCount > 0 && (
                            <div className="w-full rounded-xl border border-border bg-muted/40 p-4 md:w-72">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Configuration Status
                                    </span>
                                    {isComplete ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-success">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Valid
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-bold text-warning animate-pulse">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            Incomplete
                                        </span>
                                    )}
                                </div>

                                <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all duration-500',
                                            isComplete ? 'bg-success' : 'bg-warning'
                                        )}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <div className="text-muted-foreground">
                                        <span className="font-semibold text-foreground">{requiredFilledCount}</span> / {requiredCount}{' '}
                                        Required Set
                                    </div>
                                    {!isComplete && (
                                        <div className="rounded bg-warning/10 px-2 py-0.5 font-bold text-warning">
                                            {missingCount} Missing
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!isComplete && (
                    <div className="flex items-center gap-2 border-t border-warning/10 bg-warning/5 px-6 py-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                        <span className="text-[11px] font-medium text-warning">
                            Required fields are missing values. Changes cannot be activated until resolved.
                        </span>
                    </div>
                )}
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Profile</DialogTitle>
                        <DialogDescription>
                            {createMode === 'handler'
                                ? 'Select a settings profile for an active handler.'
                                : 'Create a reusable settings profile.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {createMode === 'handler' ? (
                            <InputField
                                label="Handler"
                                variant="select"
                                searchable
                                options={createOptions}
                                value={createValue}
                                clearable={false}
                                onChange={(event) => setCreateValue(String(event.value ?? ''))}
                                required
                            />
                        ) : (
                            <InputField
                                label="Profile Name"
                                variant="text"
                                value={createValue}
                                placeholder="e.g. staging, sandbox"
                                onChange={(event) => setCreateValue(String(event.value ?? ''))}
                                required
                            />
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button emphasis="outline" size="sm" onClick={() => setCreateOpen(false)} disabled={createBusy}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={() => void handleCreateProfile()} disabled={createBusy || createValue.trim() === ''}>
                            {createBusy ? 'Creating...' : 'Create Profile'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

// ==========================================
// Core Config Form Component
// ==========================================

export interface ConfigFormProps {
    schema: UiConfigSchemaPayload;
    initialValues?: Record<string, any>;
    onSave?: (values: Record<string, any>, profile: string) => Promise<void> | void;
    profiles?: SettingsProfile[];
    activeProfile?: string;
    onProfileChange?: (profile: string) => void;
    onProfileCreate?: (profile: string) => Promise<void> | void;
    onProfileMakeDefault?: (profile: string) => Promise<void> | void;
    canCreateProfiles?: boolean;
    createMode?: 'freeform' | 'handler';
    createOptions?: ProfileCreateOption[];
    validationResult?: ConfigValidationResult;
    title: string;
    description?: string;
    submitLabel?: string;
    method?: string;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({
    schema: rawSchema,
    initialValues: rawInitialValues = {},
    onSave,
    profiles = [],
    activeProfile = 'default',
    onProfileChange,
    onProfileCreate,
    onProfileMakeDefault,
    canCreateProfiles = false,
    createMode = 'freeform',
    createOptions = [],
    validationResult,
    title,
    description,
    submitLabel = 'Apply Changes',
}) => {
    // Normalise schema settings
    const schema = React.useMemo(() => {
        const settings = normalizeNodeRecord(rawSchema.settings);
        const tabs = Array.isArray(rawSchema.tabs) ? rawSchema.tabs : [];
        return { settings, tabs };
    }, [rawSchema]);

    const allTabs = schema.tabs;
    const tabById = React.useMemo(() => new Map(allTabs.map((t) => [t.id, t])), [allTabs]);

    // Initial flat values extracted from schema defaults and props
    const schemaInitialValues = React.useMemo(() => {
        const values: Record<string, any> = {};
        flattenInputLeaves(schema.settings).forEach((leaf) => {
            const node = leaf.node;
            const name = node.name;
            values[name] = rawInitialValues[name] ?? node.default ?? null;
        });
        return values;
    }, [schema.settings, rawInitialValues]);

    const [valueByField, setValueByField] = React.useState<Record<string, any>>({});
    const [searchQuery, setSearchQuery] = React.useState('');
    const [activeParentTabId, setActiveParentTabId] = React.useState<string | null>(null);
    const [activeTabId, setActiveTabId] = React.useState<string | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);

    // Sync state when props change
    React.useEffect(() => {
        setValueByField(schemaInitialValues);
    }, [schemaInitialValues]);

    const activeTabTokens = React.useMemo(
        () => [activeParentTabId, activeTabId].filter((v): v is string => Boolean(v)),
        [activeParentTabId, activeTabId]
    );

    // 1. Build Visibility Context
    const visibilityContext = React.useMemo(
        () => buildVisibilityContext(schema.settings, valueByField, activeTabTokens),
        [schema.settings, valueByField, activeTabTokens]
    );

    // Collect all option-controlled fields across the schema to hide them by default
    const allOptionIncludes = React.useMemo(() => {
        const allIncludes = new Set<string>();
        flattenInputLeaves(schema.settings).forEach((entry) => {
            const options = entry.node.options ?? [];
            const walkOptions = (opts: ConfigOption[]) => {
                opts.forEach((opt) => {
                    normalizeStringArray(opt.includes).forEach((inc) => allIncludes.add(inc));
                    if (opt.children) walkOptions(opt.children);
                });
            };
            walkOptions(options);
        });
        return allIncludes;
    }, [schema.settings]);

    // 2. Identify and Filter Parent Tabs
    const parentTabs = React.useMemo(() => {
        const roots = allTabs.filter((tab) => !tab.parentId);
        if (roots.length > 0) return roots;
        return allTabs;
    }, [allTabs]);

    const visibleParentTabs = React.useMemo(
        () => parentTabs.filter((tab) => isNodeVisible(tab, visibilityContext, valueByField, undefined, allOptionIncludes)),
        [parentTabs, visibilityContext, valueByField, allOptionIncludes]
    );

    React.useEffect(() => {
        if (visibleParentTabs.length === 0) {
            setActiveParentTabId(null);
            return;
        }
        if (!activeParentTabId || !visibleParentTabs.some((tab) => tab.id === activeParentTabId)) {
            setActiveParentTabId(visibleParentTabs[0].id);
        }
    }, [activeParentTabId, visibleParentTabs]);

    // 3. Identify and Filter Child Tabs
    const childTabs = React.useMemo(() => {
        if (!activeParentTabId) return [];
        return allTabs.filter((tab) => tab.parentId === activeParentTabId);
    }, [allTabs, activeParentTabId]);

    const visibleChildTabs = React.useMemo(
        () => childTabs.filter((tab) => isNodeVisible(tab, visibilityContext, valueByField, undefined, allOptionIncludes)),
        [childTabs, visibilityContext, valueByField, allOptionIncludes]
    );

    React.useEffect(() => {
        if (visibleChildTabs.length === 0) {
            setActiveTabId(null);
            return;
        }
        if (!activeTabId || !visibleChildTabs.some((tab) => tab.id === activeTabId)) {
            setActiveTabId(visibleChildTabs[0].id);
        }
    }, [activeTabId, visibleChildTabs]);

    const activeTabSet = React.useMemo(() => {
        const set = new Set<string>();
        if (activeParentTabId) set.add(activeParentTabId);
        if (activeTabId) set.add(activeTabId);
        return set;
    }, [activeParentTabId, activeTabId]);

    const activeTabRules = React.useMemo(() => {
        const includes: string[] = [];
        const excludes: string[] = [];
        activeTabSet.forEach((tabId) => {
            const tab = tabById.get(tabId);
            if (!tab) return;
            if (tab.includes) includes.push(...tab.includes);
            if (tab.excludes) excludes.push(...tab.excludes);
        });
        return { includes, excludes };
    }, [activeTabSet, tabById]);

    // 4. Counts & Sensitivity Checks
    const { requiredCount, requiredFilledCount, isSensitive } = React.useMemo(() => {
        const leaves = flattenInputLeaves(schema.settings);
        const requiredFields = leaves.filter((entry) => entry.node.required);
        const filledRequired = requiredFields.filter((entry) => {
            const val = valueByField[entry.fieldName];
            return val !== null && val !== undefined && val !== '';
        });
        const hasSensitive = leaves.some((entry) => entry.node.secret);
        return {
            requiredCount: requiredFields.length,
            requiredFilledCount: filledRequired.length,
            isSensitive: hasSensitive,
        };
    }, [schema.settings, valueByField]);

    const activeProfileRow = React.useMemo(
        () => profiles.find((p) => p.profile === activeProfile) ?? profiles.find((p) => p.is_default) ?? null,
        [activeProfile, profiles]
    );

    const hasAnySettings = Object.keys(schema.settings).length > 0;
    const query = searchQuery.trim().toLowerCase();

    // 5. Render Node Tree Recursive
    const renderNode = React.useCallback(
        (key: string, node: ConfigNode, ancestorMatched = false): React.ReactNode => {
            if (!isNodeInActiveTabs(node, activeTabSet)) return null;
            if (!isNodeVisible(node, visibilityContext, valueByField, activeTabRules, allOptionIncludes)) return null;

            if (isInputGroup(node)) {
                const groupMatches = query.length > 0 && node.label.toLowerCase().includes(query);
                const renderedChildren = Object.entries(node.children)
                    .map(([ckey, cnode]) => renderNode(ckey, cnode, ancestorMatched || groupMatches))
                    .filter(Boolean);

                if (renderedChildren.length === 0) return null;

                return (
                    <fieldset key={key} className="rounded-xl border border-border p-5 space-y-4">
                        <legend className="px-2 text-sm font-semibold tracking-tight text-foreground/90">
                            {node.label}
                        </legend>
                        <div className="grid gap-4 sm:grid-cols-2">{renderedChildren}</div>
                    </fieldset>
                );
            }

            if (isInputLeaf(node)) {
                const fieldName = node.name;
                if (query.length > 0 && !ancestorMatched) {
                    const matchesSearch =
                        node.label.toLowerCase().includes(query) ||
                        node.name.toLowerCase().includes(query) ||
                        (node.helpText && node.helpText.toLowerCase().includes(query));
                    if (!matchesSearch) return null;
                }

                const input = getInputProps(node);

                // Check for server/API errors passed down
                const fieldErrors = validationResult?.errors?.[fieldName] ?? [];
                const fieldHelpText = fieldErrors.length > 0
                    ? fieldErrors.map((e) => e.message).join(' ')
                    : node.helpText;

                return (
                    <InputField
                        key={fieldName}
                        variant={input.variant as any}
                        {...input.props}
                        name={fieldName}
                        value={valueByField[fieldName] ?? ''}
                        helpText={node.secret && !fieldErrors.length ? 'Value is hidden securely' : fieldHelpText}
                        error={fieldErrors.length > 0 ? fieldErrors.map((e) => e.message).join(' ') : undefined}
                        onChange={(event: any) => {
                            const next = pickEventValue(event);
                            setValueByField((prev) => ({
                                ...prev,
                                [fieldName]: next,
                            }));
                        }}
                    />
                );
            }
            return null;
        },
        [activeTabRules, activeTabSet, query, visibilityContext, valueByField, validationResult]
    );

    const visibleEntries = React.useMemo(() => {
        return Object.entries(schema.settings)
            .map(([key, node]) => renderNode(key, node))
            .filter(Boolean);
    }, [renderNode, schema.settings]);

    const hasVisibleEntries = visibleEntries.length > 0;

    async function handleSubmit() {
        if (!onSave) return;
        setIsSaving(true);
        try {
            await onSave(valueByField, activeProfile);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <ConfigFormHeader
                requiredCount={requiredCount}
                requiredFilledCount={requiredFilledCount}
                isSensitive={isSensitive}
                title={title}
                description={description}
                profile={activeProfileRow}
                profiles={profiles}
                canCreateProfiles={canCreateProfiles}
                createMode={createMode}
                createOptions={createOptions}
                onProfileChange={onProfileChange}
                onProfileCreate={onProfileCreate}
                onProfileMakeDefault={onProfileMakeDefault}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
            />

            {hasAnySettings ? (
                <Card className="border border-border/80 shadow-sm p-6">
                    <Form
                        key={activeProfile}
                        adapter="local"
                        wrapped
                        gap="1.5rem"
                        onSubmit={handleSubmit}
                    >
                        {visibleParentTabs.length > 0 && (
                            <div className="flex flex-col gap-3 pb-3 border-b border-border/60">
                                <Tabs
                                    value={activeParentTabId ?? undefined}
                                    onChange={(next) => setActiveParentTabId(String(next))}
                                    overflow="scroll"
                                    variant="underline"
                                    size="sm"
                                    tabs={visibleParentTabs.map((t) => ({ id: t.id, label: t.label }))}
                                    tabClassName="text-xs font-semibold px-3 pb-2 -mb-[2px] transition-colors hover:text-foreground/90"
                                />

                                {visibleChildTabs.length > 0 && (
                                    <Tabs
                                        value={activeTabId ?? undefined}
                                        onChange={(next) => setActiveTabId(String(next))}
                                        overflow="scroll"
                                        variant="underline"
                                        size="xs"
                                        tabs={visibleChildTabs.map((t) => ({ id: t.id, label: t.label }))}
                                        tabClassName="text-xs font-semibold px-2 py-1 -mb-[2px] opacity-75 hover:opacity-100"
                                    />
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-6 py-2">
                            {hasVisibleEntries ? (
                                visibleEntries
                            ) : (
                                <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground bg-muted/10">
                                    {query ? 'No fields match your search term.' : 'No configuration settings are visible.'}
                                </div>
                            )}
                        </div>

                        {hasVisibleEntries && (
                            <div className="flex justify-end pt-2 border-t border-border/60">
                                <SubmitButton loading={isSaving}>
                                    {submitLabel}
                                </SubmitButton>
                            </div>
                        )}
                    </Form>
                </Card>
            ) : (
                <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                    No configuration settings loaded.
                </div>
            )}
        </div>
    );
};
