import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface CommandSearchResult {
    id: string | number;
    subject: string;
    title: string;
    subtitle?: string | null;
    badge?: string | null;
    meta?: Record<string, unknown> | null;
}

export interface CommandSearchRegistryEntry {
    subject: string;
    label: string;
    description: string;
    icon: LucideIcon;
    placeholder: string;
}

export interface CommandSearchProps {
    entries: CommandSearchRegistryEntry[];
    onSearch: (query: string, subject: string) => Promise<CommandSearchResult[]>;
    onSelectResult: (result: CommandSearchResult) => void;
    children?: React.ReactNode;
}

export interface CommandSearchContextValue {
    open: () => void;
}
